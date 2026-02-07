## CTF Challenge Solutions

This document lists the default seeded challenges in this CTF instance and their solutions/flags.

> **Note**: These are the flags and high-level solution approaches for the sample data from `scripts/seed-challenges.sql`. If you change or add challenges in the database, update this file accordingly.

---

## Web Security

### 1. SQL Injection 101

- **Category**: Web Security
- **Difficulty**: easy
- **Points**: 10
- **Description**: A simple login form with SQL injection. Try entering a simple payload to bypass authentication.

- **Flag**: `flag{sql_inj3ct1on}`

- **Solution idea**:
  - The login form likely builds a query such as `SELECT * FROM users WHERE username = '$user' AND password = '$pass'`.
  - Use a classic authentication bypass payload in either the username or password field, e.g.:
    - Username: `admin' OR '1'='1`  
      Password: anything
  - If input is unsanitized, the `OR '1'='1'` condition makes the WHERE clause always true, logging you in and revealing the flag.

---

### 2. XSS Vulnerability

- **Category**: Web Security
- **Difficulty**: medium
- **Points**: 25
- **Description**: A web application is vulnerable to cross-site scripting. Find a way to execute arbitrary JavaScript code.

- **Flag**: `flag{xss_payload_success}`

- **Solution idea**:
  - Identify a field that reflects user input into the page without HTML encoding (e.g., comments, profile name, search query).
  - Inject a script payload, for example:
    - `<script>alert(1)</script>`
  - If `<script>` tags are filtered but attributes are not, use alternative vectors like:
    - `<img src=x onerror=alert(1)>`
  - Once arbitrary JS execution is demonstrated, the challenge is solved and the flag is revealed (for example via alert, DOM content, or a special endpoint).

---

### 3. CSRF Attack

- **Category**: Web Security
- **Difficulty**: hard
- **Points**: 50
- **Description**: Exploit CSRF vulnerability to perform unauthorized actions on behalf of a user.

- **Flag**: `flag{csrf_protected}`

- **Solution idea**:
  - Find a state-changing endpoint (e.g., change email, change password, transfer points) that:
    - Uses only cookies for auth, and
    - Lacks CSRF protections (no CSRF token, no SameSite protection assumptions, etc.).
  - Craft an HTML form or request that triggers this action and host it on an external site:
    \`\`\`html
    <form action="https://victim-site/action" method="POST">
      <input type="hidden" name="some_param" value="malicious_value">
    </form>
    <script>document.forms[0].submit();</script>
    \`\`\`
  - Have a logged-in victim visit your page so their browser auto-sends their cookies, performing the action and triggering the flag.

---

## Cryptography

### 4. Caesar Cipher

- **Category**: Cryptography
- **Difficulty**: easy
- **Points**: 10
- **Description**: A message encrypted with a Caesar cipher with shift 3. Decrypt it to find the flag.

- **Flag**: `flag{caesar_shift3}`

- **Solution idea**:
  - A Caesar cipher with shift 3 means each letter has been shifted by 3 positions (commonly to the right):
    - Example: `A → D`, `B → E`, etc.
  - To decrypt, shift all alphabetic characters 3 positions back:
    - `D → A`, `E → B`, etc.
  - Apply this decryption (manually, with a script, or an online tool) to the given ciphertext to obtain the flag string.

---

### 5. RSA Encryption

- **Category**: Cryptography
- **Difficulty**: medium
- **Points**: 25
- **Description**: You have the public key and ciphertext. Find the plaintext.

- **Flag**: `flag{rsa_broken}`

- **Solution idea**:
  - Analyze the given public key parameters \(n, e\).
  - If \(n\) is small or composed of weak primes, factor \(n = p \cdot q\) using integer factorization tools (e.g., `yafu`, `msieve`, online factorization).
  - Compute \(\phi(n) = (p-1)(q-1)\) and find the private exponent \(d = e^{-1} \bmod \phi(n)\).
  - Decrypt the ciphertext \(c\) using \(m = c^d \bmod n\) to recover the plaintext flag.

---

### 6. XOR Repeating Key

- **Category**: Cryptography
- **Difficulty**: hard
- **Points**: 50
- **Description**: Break a repeating-key XOR cipher.

- **Flag**: `flag{xor_repeating_key_cracked}`

- **Solution idea**:
  - Estimate the key length using repeating patterns or index of coincidence.
  - Group ciphertext bytes by key positions and apply frequency analysis to recover the key characters.
  - Once the key is known, decrypt the message and submit the plaintext flag string.

---

## Reverse Engineering

### 7. Simple Binary

- **Category**: Reverse Engineering
- **Difficulty**: easy
- **Points**: 10
- **Description**: Use a disassembler to understand what the binary does and find the flag.

- **Flag**: `flag{binary_analyzed}`

- **Solution idea**:
  - Open the binary in a disassembler (Ghidra, IDA, Radare2, Binary Ninja, etc.).
  - Look for string constants and flag-like patterns (`flag{...}`) in the `.rodata` section or as referenced in comparison logic.
  - Often the main function compares user input to a hard-coded string; identify that string as the flag.

---

### 8. Obfuscated Code

- **Category**: Reverse Engineering
- **Difficulty**: medium
- **Points**: 25
- **Description**: The code is obfuscated. Deobfuscate it to find the hidden flag.

- **Flag**: `flag{deobfuscated_code}`

- **Solution idea**:
  - Identify common obfuscation patterns: string building at runtime, opaque predicates, junk code, control-flow flattening, etc.
  - Use a combination of:
    - Static analysis (rename functions/variables, simplify expressions).
    - Dynamic analysis (run under a debugger, set breakpoints, watch decrypted strings in memory).
  - At some point, the real flag string is constructed or compared; capture it from memory or logs.

---

### 9. Anti-Debug Technique

- **Category**: Reverse Engineering
- **Difficulty**: hard
- **Points**: 50
- **Description**: The binary has anti-debug protections. Bypass them to extract the flag.

- **Flag**: `flag{debugger_bypass}`

- **Solution idea**:
  - Look for anti-debug techniques (e.g., `IsDebuggerPresent`, timing checks, `ptrace`, `int 3`, self-checksumming).
  - Patch out or bypass the anti-debug code:
    - NOP relevant instructions.
    - Force conditionals to take the “no debugger detected” path.
  - Once anti-debugging is disabled, debug normally and inspect the flag-check routine or watch memory for flag-like strings.

---

## Forensics

### 10. Memory Dump Analysis

- **Category**: Forensics
- **Difficulty**: easy
- **Points**: 10
- **Description**: A memory dump contains sensitive information. Find the flag hidden in it.

- **Flag**: `flag{memory_extracted}`

- **Solution idea**:
  - Use a memory forensics framework (e.g., Volatility/Volatility 3) on the dump.
  - Search for `flag{` strings directly, or inspect processes and their memory regions for plaintext secrets.
  - Grep-like searching (`strings` + filter) is often sufficient to spot the flag in beginner-level dumps.

---

### 11. Log File Investigation

- **Category**: Forensics
- **Difficulty**: medium
- **Points**: 25
- **Description**: Analyze server logs to find evidence of a breach and the flag.

- **Flag**: `flag{breach_detected}`

- **Solution idea**:
  - Examine access and error logs for anomalies: suspicious IP addresses, strange user agents, unusual parameters, or high error rates.
  - Follow the attacker's trail (e.g., exploitation of a vulnerable endpoint, LFI/RFI, or path traversal) and look for lines where the application prints or leaks sensitive data.
  - The flag is typically embedded in one of these malicious requests or in the resulting error/response log line.

---

### 12. Disk Image Recovery

- **Category**: Forensics
- **Difficulty**: hard
- **Points**: 50
- **Description**: Find the deleted flag from a disk image using forensic techniques.

- **Flag**: `flag{your_hidden_flag}`

- **Solution idea**:
  - Use the `strings` command to extract readable text from the disk image.
  - On Windows: `strings.exe 1mb.iso | findstr hidden`
  - On Linux/Mac: `strings 1mb.iso | grep hidden`
  - The flag contains the word "hidden" and can be found by filtering the strings output.

---

## OSINT

### 13. Landmark + Timeline Correlation

- **Category**: OSINT
- **Difficulty**: medium
- **Points**: 25
- **Description**: Correlate a landmark opening date and key engineer using public records.

- **Flag**: `flag{monday_gustave_eiffel}`

- **Solution idea**:
  - Search reputable historical archives or the official site for the Eiffel Tower to confirm the public opening date (May 6, 1889).
  - Use a perpetual calendar calculator or historical newspaper archive to determine the weekday (Monday) for that date.
  - Verify the chief engineer by consulting biographical records on the tower's construction team (Gustave Eiffel headed the project).
  - Combine the weekday and engineer's name to form the flag.

---

### 14. Corporate Footprint Reconstruction

- **Category**: OSINT
- **Difficulty**: medium
- **Points**: 25
- **Description**: Reconstruct a company's registered office address from public records.

- **Flag**: `flag{1_rocket_road_hawthorne_ca}`

- **Solution idea**:
  - Review SEC filings, launch press releases, or California business registry entries from 2010 to confirm SpaceX's listed headquarters.
  - Cross-reference with archived news articles about the first Falcon 9 launch to validate the location.
  - Note the complete street address (1 Rocket Road, Hawthorne, CA 90250) used in official documents.
  - Normalize the address components and combine them to obtain the flag value.

---

### 15. Aviation + Open Registries

- **Category**: OSINT
- **Difficulty**: medium
- **Points**: 25
- **Description**: Correlate flight tracker logs with registry data to identify an aircraft.

- **Flag**: `flag{n212ua_1995}`

- **Solution idea**:
  - Review flight-tracking archives covering the 2023 emergency diversion to capture the airline, flight number, and aircraft registration.
  - Confirm the registration using FAA or ICAO aircraft registries as well as planespotter databases.
  - Cross-check airframe histories or delivery records to extract the original manufacture year.
  - Combine the tail number (e.g., N212UA) and the manufacture year (1995) in the required flag format.

---

### 16. Organizational Change Tracking

- **Category**: OSINT
- **Difficulty**: hard
- **Points**: 50
- **Description**: Track leadership renewals at a global health body.

- **Flag**: `flag{may_2022}`

- **Solution idea**:
  - Search the WHO newsroom archive for press releases surrounding the 75th World Health Assembly during the COVID period.
  - Confirm the formal vote that renewed Tedros Adhanom Ghebreyesus for a second term and note when the result was announced.
  - Cross-check with archived Executive Board documents and independent coverage to validate the same month and year.
  - Combine the month (May) and year (2022) in the prescribed flag format.

---

## Miscellaneous

### 17. Steganography

- **Category**: Miscellaneous
- **Difficulty**: easy
- **Points**: 10
- **Description**: An image contains a hidden message. Extract it to find the flag.

- **Flag**: `flag{stego_found}`

- **Solution idea**:
  - Try basic steganography tools/techniques:
    - `strings` on the image.
    - Checking metadata (EXIF) for notes.
    - LSB steganography tools (e.g., `stegsolve`, `zsteg`, `steghide`).
  - The hidden message (in pixels, metadata, or embedded file) reveals the flag.

---

### 18. Password Cracking

- **Category**: Miscellaneous
- **Difficulty**: medium
- **Points**: 25
- **Description**: You have a hashed password. Crack it using a dictionary attack.

- **Flag**: `flag{password_cracked}`

- **Solution idea**:
  - Identify the hash algorithm (often hinted in the challenge description or recognizable by hash length/prefix).
  - Use a cracking tool like `hashcat` or `John the Ripper` with a common wordlist (e.g., `rockyou.txt`).
  - Once you recover the plaintext password, use it as instructed (e.g., log in to a service or submit it directly) to obtain the flag.

---

### 19. Social Engineering

- **Category**: Miscellaneous
- **Difficulty**: hard
- **Points**: 50
- **Description**: Use social engineering techniques to extract sensitive information.

- **Flag**: `flag{soceng_success}`

- **Solution idea**:
  - Follow the narrative: you may need to craft convincing emails, chat messages, or phone scripts (simulated in the challenge environment).
  - Leverage information from OSINT (public profiles, leaked documents) to build trust.
  - When the “target” reveals the sensitive info (often directly the flag or a credential that leads to the flag), record and submit it.

---

## Networking

### 20. Packet Analysis

- **Category**: Networking
- **Difficulty**: easy
- **Points**: 10
- **Description**: Examine a PCAP file to find the flag transmitted over the network.

- **Flag**: `flag{packet_found}`

- **Solution idea**:
  - Open the PCAP in Wireshark or similar tools.
  - Inspect protocols carrying potential cleartext data (HTTP, FTP, SMTP, telnet, etc.).
  - Follow streams (e.g., “Follow TCP stream”) to reconstruct conversations and look for `flag{...}` in the payload.

---

### 21. DNS Enumeration

- **Category**: Networking
- **Difficulty**: medium
- **Points**: 25
- **Description**: Find subdomains by enumerating DNS records to locate the flag.

- **Flag**: `flag{dns_enumerated}`

- **Solution idea**:
  - Use DNS enumeration tools such as `nslookup`, `dig`, `dnsenum`, `amass`, or `sublist3r`.
  - Look for unusual subdomains (e.g., `admin`, `backup`, `dev`, or obviously flag-related names).
  - Once a special subdomain is discovered, visit it or query related records (TXT/hidden path) to reveal the flag.

---

### 22. Man-in-the-Middle Attack

- **Category**: Networking
- **Difficulty**: hard
- **Points**: 50
- **Description**: Intercept encrypted traffic using MITM techniques to find the flag.

- **Flag**: `flag{mitm_success}`

- **Solution idea**:
  - Position yourself as a man-in-the-middle via ARP spoofing, rogue access point, or proxy configuration (depending on the challenge story).
  - Capture traffic (e.g., with Wireshark or `tcpdump`) while the victim communicates with the service.
  - If TLS is weak/misconfigured (e.g., accepting your certificate), decrypt or strip the encryption to see the plaintext traffic and extract the flag.
