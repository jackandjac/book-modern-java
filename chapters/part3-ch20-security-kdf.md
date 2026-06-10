# Chapter 20: Security Enhancements — Key Derivation Function API and PEM Encodings

Java 25 brings two significant security additions: the Key Derivation Function API (JEP 510, finalized) and PEM Encodings for Cryptographic Objects (JEP 470, preview). Together they address important gaps in Java's cryptography landscape — standardized key derivation and native PEM format support.

---

## 20.1 What Is Key Derivation and Why It Matters

A Key Derivation Function (KDF) derives cryptographic key material from a primary secret. This is fundamental to:

- **TLS handshakes**: deriving session keys from a shared secret
- **Password-based encryption**: deriving an AES key from a user password (PBKDF2)
- **Application-level security**: deriving multiple purpose-specific keys from a master key
- **Post-quantum cryptography**: key derivation is central to many PQC schemes

Before Java 25, Java developers had to use provider-specific APIs or third-party libraries (Bouncy Castle) for standardized KDF operations. The new `KDF` API brings this into the standard JDK.

---

## 20.2 KDF API Overview (JEP 510 — Finalized Java 25)

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

The API follows the established `getInstance()` factory pattern familiar from `Cipher`, `MessageDigest`, and `KeyPairGenerator`.

---

## 20.3 HKDF — HMAC-based Key Derivation Function

HKDF (RFC 5869) is the most widely used modern KDF. It consists of two steps:
1. **Extract**: distill entropy from input key material (IKM) using a salt
2. **Expand**: produce output key material (OKM) of any desired length

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

        // extractExpand() chains Extract (from IKM + salt) then Expand (with info)
        // in a single spec — this is the standard full HKDF operation
        HKDFParameterSpec spec = HKDFParameterSpec.ofExtract()
            .addIKM(inputKeyMaterial)
            .addSalt(salt)
            .extractExpand(info, AES_256_KEY_SIZE);

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
        KDF hkdf2 = KDF.getInstance("HKDF-SHA256");
        HKDFParameterSpec hmacSpec = HKDFParameterSpec.ofExtract()
            .addIKM(sharedSecret)
            .addSalt(salt)
            .extractExpand(hmacInfo, 32);
        SecretKey hmacKey = hkdf2.deriveKey("HmacSHA256", hmacSpec);
        System.out.println("HMAC key: " + hmacKey.getAlgorithm());
    }
}
```

---

## 20.4 PBKDF2 — Password-Based Key Derivation

PBKDF2 (Password-Based Key Derivation Function 2) is the standard for deriving keys from user passwords. The new API makes it cleaner than the old `SecretKeyFactory` approach:

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

## 20.5 PEM Encodings API (JEP 470 — Preview in Java 25)

PEM (Privacy-Enhanced Mail) format is the ubiquitous format for storing and exchanging cryptographic objects — public keys, private keys, certificates, CSRs. Every `openssl` output, every TLS certificate, every SSH key uses PEM.

Before Java 25, there was no standard PEM encoding/decoding in the JDK. Developers used Bouncy Castle or hand-rolled Base64 parsing.

### Encoding Keys to PEM

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

### Loading TLS Certificates from PEM Files

A common real-world use case:

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

## 20.6 Security Best Practices

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

## 20.7 Summary

Java 25's security enhancements:

- **KDF API (JEP 510, final)**: standard `KDF.getInstance()` factory for HKDF and PBKDF2
  - `HKDF-SHA256`: modern key derivation for session keys, derived subkeys
  - `PBKDF2WithHmacSHA256`: password-based key derivation with configurable iterations
- **PEM Encodings (JEP 470, preview)**: `PEMEncoder` and `PEMDecoder` for encoding/decoding cryptographic objects to/from PEM format
  - Load private keys, public keys, certificates from `.pem` files natively
  - Encode keys and certificates for export/storage

These APIs eliminate the need for Bouncy Castle in many common cryptography workflows, reducing dependency complexity while improving security through well-vetted standard implementations.
