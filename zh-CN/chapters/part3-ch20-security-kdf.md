# 第20章：安全增强 — 密钥派生函数 API 与 PEM 编码

Java 25 带来了两项重要的安全新特性：密钥派生函数（Key Derivation Function）API（JEP 510，正式版）和加密对象的 PEM 编码（PEM Encodings）（JEP 470，预览版）。它们共同填补了 Java 密码学体系中的重要空白 — 标准化的密钥派生和原生 PEM 格式支持。

---

## 20.1 什么是密钥派生及其重要性

密钥派生函数（Key Derivation Function, KDF）从主密钥中派生出加密密钥材料。这在以下场景中至关重要：

- **TLS 握手**：从共享密钥派生会话密钥
- **基于密码的加密**：从用户密码派生 AES 密钥（PBKDF2）
- **应用层安全**：从主密钥派生多个特定用途的密钥
- **后量子密码学（Post-quantum cryptography）**：密钥派生是许多 PQC 方案的核心

在 Java 25 之前，Java 开发者必须使用特定提供者的 API 或第三方库（如 Bouncy Castle）来执行标准化的 KDF 操作。新的 `KDF` API 将这一功能纳入了标准 JDK。

---

## 20.2 KDF API 概览（JEP 510 — Java 25 正式版）

```java
import javax.crypto.KDF;
import javax.crypto.spec.HKDFParameterSpec;
import java.security.spec.AlgorithmParameterSpec;

// The core interface
KDF kdf = KDF.getInstance("HKDF-SHA256");

// derive a SecretKey
SecretKey derivedKey = kdf.deriveKey("AES", spec);

// derive raw bytes
byte[] keyMaterial = kdf.deriveData(spec);
```

该 API 遵循已有的 `getInstance()` 工厂模式（factory pattern），这与 `Cipher`、`MessageDigest` 和 `KeyPairGenerator` 的使用方式一致。

---

## 20.3 HKDF — 基于 HMAC 的密钥派生函数

HKDF（RFC 5869）是目前最广泛使用的现代 KDF。它包含两个步骤：
1. **提取（Extract）**：使用盐值（salt）从输入密钥材料（IKM）中提炼熵
2. **扩展（Expand）**：生成任意所需长度的输出密钥材料（OKM）

```java
import javax.crypto.KDF;
import javax.crypto.SecretKey;
import javax.crypto.spec.HKDFParameterSpec;
import java.security.SecureRandom;

public class HkdfExample {

    private static final int AES_256_KEY_SIZE = 32; // 256 bits = 32 bytes

    // Extract-then-expand: the full HKDF operation
    public static SecretKey deriveAesKey(byte[] inputKeyMaterial, byte[] salt, byte[] info)
            throws Exception {
        KDF hkdf = KDF.getInstance("HKDF-SHA256");

        HKDFParameterSpec spec = HKDFParameterSpec.expandOnly(
            // First run extract to get a pseudorandom key (PRK)
            HKDFParameterSpec.ofExtract()
                .addIKM(inputKeyMaterial)
                .addSalt(salt)
                .extractExpand(info, AES_256_KEY_SIZE)
        );

        return hkdf.deriveKey("AES", spec);
    }

    // Just the Expand step (when you already have a PRK)
    public static byte[] expand(byte[] prk, byte[] info, int length) throws Exception {
        KDF hkdf = KDF.getInstance("HKDF-SHA256");

        HKDFParameterSpec spec = HKDFParameterSpec.expandOnly(prk, info, length);

        return hkdf.deriveData(spec);
    }

    // Practical example: derive AES and HMAC keys from a shared Diffie-Hellman secret
    public static void main(String[] args) throws Exception {
        // Simulated shared secret from ECDH key exchange
        byte[] sharedSecret = new byte[32];
        new SecureRandom().nextBytes(sharedSecret);

        byte[] salt = new byte[32];
        new SecureRandom().nextBytes(salt);

        // Derive AES key for encryption
        byte[] aesInfo = "encryption-key-v1".getBytes();
        SecretKey aesKey = deriveAesKey(sharedSecret, salt, aesInfo);
        System.out.println("AES key algorithm: " + aesKey.getAlgorithm());
        System.out.println("AES key length: " + aesKey.getEncoded().length + " bytes");

        // Derive HMAC key for authentication
        byte[] hmacInfo = "authentication-key-v1".getBytes();
        KDF hkdf = KDF.getInstance("HKDF-SHA256");
        HKDFParameterSpec hmacSpec = HKDFParameterSpec.expandOnly(
            HKDFParameterSpec.ofExtract().addIKM(sharedSecret).addSalt(salt)
                .extractExpand(hmacInfo, 32)
        );
        SecretKey hmacKey = hkdf.deriveKey("HmacSHA256", hmacSpec);
        System.out.println("HMAC key: " + hmacKey.getAlgorithm());
    }
}
```

---

## 20.4 PBKDF2 — 基于密码的密钥派生

PBKDF2（Password-Based Key Derivation Function 2）是从用户密码派生密钥的标准方法。新 API 比旧的 `SecretKeyFactory` 方式更加简洁：

```java
import javax.crypto.KDF;
import javax.crypto.SecretKey;
import javax.crypto.spec.PBEKeySpec;
import java.security.spec.AlgorithmParameterSpec;

public class PasswordDerivedKey {

    private static final int ITERATIONS = 600_000;  // NIST recommendation 2023
    private static final int KEY_LENGTH_BITS = 256;
    private static final int SALT_BYTES = 32;

    public static SecretKey deriveFromPassword(char[] password, byte[] salt)
            throws Exception {
        KDF pbkdf2 = KDF.getInstance("PBKDF2WithHmacSHA256");

        // New API: cleaner than the old SecretKeyFactory path
        AlgorithmParameterSpec spec = new PBEKeySpec(
            password,
            salt,
            ITERATIONS,
            KEY_LENGTH_BITS
        );

        return pbkdf2.deriveKey("AES", spec);
    }

    // Generate a cryptographically random salt
    public static byte[] generateSalt() {
        byte[] salt = new byte[SALT_BYTES];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    // Usage example: storing a user password securely
    record StoredPassword(byte[] salt, byte[] hash) {}

    public static StoredPassword hashPassword(char[] password) throws Exception {
        byte[] salt = generateSalt();
        SecretKey key = deriveFromPassword(password, salt);
        return new StoredPassword(salt, key.getEncoded());
    }

    public static boolean verifyPassword(char[] password, StoredPassword stored)
            throws Exception {
        SecretKey key = deriveFromPassword(password, stored.salt());
        return MessageDigest.isEqual(key.getEncoded(), stored.hash());
    }
}
```

---

## 20.5 PEM 编码 API（JEP 470 — Java 25 预览版）

PEM（Privacy-Enhanced Mail）格式是存储和交换加密对象的通用格式 — 包括公钥、私钥、证书和证书签名请求（CSR）。每一个 `openssl` 的输出、每一张 TLS 证书、每一个 SSH 密钥都使用 PEM 格式。

在 Java 25 之前，JDK 中没有标准的 PEM 编码/解码功能。开发者不得不使用 Bouncy Castle 或手动编写 Base64 解析代码。

### 将密钥编码为 PEM 格式

```java
import java.security.*;
import java.security.pem.PEMEncoder;
import java.security.pem.PEMDecoder;

public class PemExample {

    // Encode a key pair to PEM format
    public static void encodePem() throws Exception {
        KeyPairGenerator gen = KeyPairGenerator.getInstance("EC");
        gen.initialize(256);
        KeyPair keyPair = gen.generateKeyPair();

        PEMEncoder encoder = PEMEncoder.of();

        // Encode private key
        String privateKeyPem = encoder.encodeToString(keyPair.getPrivate());
        System.out.println(privateKeyPem);
        // -----BEGIN PRIVATE KEY-----
        // MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg...
        // -----END PRIVATE KEY-----

        // Encode public key
        String publicKeyPem = encoder.encodeToString(keyPair.getPublic());
        System.out.println(publicKeyPem);
        // -----BEGIN PUBLIC KEY-----
        // MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...
        // -----END PUBLIC KEY-----
    }

    // Encode a certificate to PEM
    public static String encodeCertificate(X509Certificate cert) throws Exception {
        PEMEncoder encoder = PEMEncoder.of();
        return encoder.encodeToString(cert);
    }

    // Decode a PEM-encoded private key
    public static PrivateKey decodePemPrivateKey(String pemString) throws Exception {
        PEMDecoder decoder = PEMDecoder.of();
        return (PrivateKey) decoder.decode(pemString).get(0);
    }

    // Decode from file
    public static PrivateKey loadPrivateKeyFromFile(Path pemFile) throws Exception {
        String pemContent = Files.readString(pemFile);
        PEMDecoder decoder = PEMDecoder.of();
        var decodedObjects = decoder.decode(pemContent);
        return decodedObjects.stream()
            .filter(o -> o instanceof PrivateKey)
            .map(o -> (PrivateKey) o)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("No private key found in PEM"));
    }
}
```

### 从 PEM 文件加载 TLS 证书

一个常见的实际使用场景：

```java
public class TlsContextBuilder {

    public static SSLContext buildFromPem(Path certPem, Path keyPem) throws Exception {
        PEMDecoder decoder = PEMDecoder.of();

        // Load certificate
        String certContent = Files.readString(certPem);
        X509Certificate cert = (X509Certificate) decoder.decode(certContent).get(0);

        // Load private key
        String keyContent = Files.readString(keyPem);
        PrivateKey privateKey = (PrivateKey) decoder.decode(keyContent).get(0);

        // Build KeyStore
        KeyStore ks = KeyStore.getInstance("PKCS12");
        ks.load(null, null);
        ks.setKeyEntry("server", privateKey, new char[0],
            new Certificate[]{cert});

        // Build SSLContext
        KeyManagerFactory kmf = KeyManagerFactory.getInstance(
            KeyManagerFactory.getDefaultAlgorithm());
        kmf.init(ks, new char[0]);

        SSLContext ctx = SSLContext.getInstance("TLS");
        ctx.init(kmf.getKeyManagers(), null, null);
        return ctx;
    }
}
```

---

## 20.6 安全最佳实践

```java
// 1. Always use appropriate iteration counts for PBKDF2
//    NIST SP 800-63B (2023) recommends >= 600,000 for SHA-256
private static final int MIN_PBKDF2_ITERATIONS = 600_000;

// 2. Always use a random, unique salt per password/key derivation
byte[] salt = new byte[32];
new SecureRandom().nextBytes(salt);

// 3. Clear sensitive data from memory after use
char[] password = getPassword();
try {
    // use password
} finally {
    Arrays.fill(password, '\0');  // clear from memory
}

// 4. Don't use HKDF Extract-only — always include Expand
// The PRK from Extract alone should not be used as a key directly

// 5. Use algorithm-specific info strings to domain-separate derived keys
byte[] aesInfo  = "v1:com.example:aes-encryption".getBytes(StandardCharsets.UTF_8);
byte[] hmacInfo = "v1:com.example:hmac-auth".getBytes(StandardCharsets.UTF_8);
```

---

## 20.7 总结

Java 25 的安全增强：

- **KDF API（JEP 510，正式版）**：标准的 `KDF.getInstance()` 工厂方法，支持 HKDF 和 PBKDF2
  - `HKDF-SHA256`：用于会话密钥和派生子密钥的现代密钥派生
  - `PBKDF2WithHmacSHA256`：支持可配置迭代次数的基于密码的密钥派生
- **PEM 编码（JEP 470，预览版）**：`PEMEncoder` 和 `PEMDecoder` 用于将加密对象编码为 PEM 格式或从 PEM 格式解码
  - 原生支持从 `.pem` 文件加载私钥、公钥和证书
  - 将密钥和证书编码用于导出/存储

这些 API 在许多常见的密码学工作流程中消除了对 Bouncy Castle 的依赖，在降低依赖复杂度的同时，通过经过充分验证的标准实现提升了安全性。
