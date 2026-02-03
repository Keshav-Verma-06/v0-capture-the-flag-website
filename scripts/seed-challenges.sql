-- Seed sample challenges for the CTF event

-- Web Security challenges
INSERT INTO challenges (title, category, difficulty, target_year, description, full_description, flag_hash, points)
VALUES 
  ('SQL Injection 101', 'Web Security', 'easy', '2025', 'Find the SQL injection vulnerability', 'A simple login form with SQL injection. Try entering a simple payload to bypass authentication.', 'flag{sql_inj3ct1on}', 10),
  ('XSS Vulnerability', 'Web Security', 'medium', '2025', 'Execute JavaScript in the browser', 'A web application is vulnerable to cross-site scripting. Find a way to execute arbitrary JavaScript code.', 'flag{xss_payload_success}', 25),
  ('CSRF Attack', 'Web Security', 'hard', '2025', 'Perform a cross-site request forgery attack', 'Exploit CSRF vulnerability to perform unauthorized actions on behalf of a user.', 'flag{csrf_protected}', 50);

-- Cryptography challenges
INSERT INTO challenges (title, category, difficulty, target_year, description, full_description, flag_hash, points)
VALUES 
  ('Caesar Cipher', 'Cryptography', 'easy', '2025', 'Decrypt a message using Caesar cipher', 'A message encrypted with a Caesar cipher with shift 3. Decrypt it to find the flag.', 'flag{caesar_shift3}', 10),
  ('RSA Encryption', 'Cryptography', 'medium', '2025', 'Break RSA encryption', 'You have the public key and ciphertext. Find the plaintext.', 'flag{rsa_broken}', 25),
  ('Hash Collision', 'Cryptography', 'hard', '2025', 'Find a hash collision', 'Find two different inputs that produce the same MD5 hash.', 'flag{hash_collision_found}', 50);

-- Reverse Engineering challenges
INSERT INTO challenges (title, category, difficulty, target_year, description, full_description, flag_hash, points)
VALUES 
  ('Simple Binary', 'Reverse Engineering', 'easy', '2025', 'Analyze a compiled binary', 'Use a disassembler to understand what the binary does and find the flag.', 'flag{binary_analyzed}', 10),
  ('Obfuscated Code', 'Reverse Engineering', 'medium', '2025', 'Reverse engineer obfuscated code', 'The code is obfuscated. Deobfuscate it to find the hidden flag.', 'flag{deobfuscated_code}', 25),
  ('Anti-Debug Technique', 'Reverse Engineering', 'hard', '2025', 'Bypass anti-debugging mechanisms', 'The binary has anti-debug protections. Bypass them to extract the flag.', 'flag{debugger_bypass}', 50);

-- Forensics challenges
INSERT INTO challenges (title, category, difficulty, target_year, description, full_description, flag_hash, points)
VALUES 
  ('Memory Dump Analysis', 'Forensics', 'easy', '2025', 'Analyze a memory dump', 'A memory dump contains sensitive information. Find the flag hidden in it.', 'flag{memory_extracted}', 10),
  ('Log File Investigation', 'Forensics', 'medium', '2025', 'Investigate suspicious log entries', 'Analyze server logs to find evidence of a breach and the flag.', 'flag{breach_detected}', 25),
  ('Disk Image Recovery', 'Forensics', 'hard', '2025', 'Recover data from a disk image', 'Find the deleted flag from a disk image using forensic techniques.', 'flag{your_hidden_flag}', 50);

-- Miscellaneous challenges
INSERT INTO challenges (title, category, difficulty, target_year, description, full_description, flag_hash, points)
VALUES 
  ('Steganography', 'Miscellaneous', 'easy', '2025', 'Extract hidden data from an image', 'An image contains a hidden message. Extract it to find the flag.', 'flag{stego_found}', 10),
  ('Password Cracking', 'Miscellaneous', 'medium', '2025', 'Crack a weak password hash', 'You have a hashed password. Crack it using a dictionary attack.', 'flag{password_cracked}', 25),
  ('Social Engineering', 'Miscellaneous', 'hard', '2025', 'Gather information through social engineering', 'Use social engineering techniques to extract sensitive information.', 'flag{soceng_success}', 50);

-- Networking challenges
INSERT INTO challenges (title, category, difficulty, target_year, description, full_description, flag_hash, points)
VALUES 
  ('Packet Analysis', 'Networking', 'easy', '2025', 'Analyze network packets', 'Examine a PCAP file to find the flag transmitted over the network.', 'flag{packet_found}', 10),
  ('DNS Enumeration', 'Networking', 'medium', '2025', 'Enumerate DNS records', 'Find subdomains by enumerating DNS records to locate the flag.', 'flag{dns_enumerated}', 25),
  ('Man-in-the-Middle Attack', 'Networking', 'hard', '2025', 'Perform a MITM attack', 'Intercept encrypted traffic using MITM techniques to find the flag.', 'flag{mitm_success}', 50);

-- OSINT (Open Source Intelligence) challenges
INSERT INTO challenges (title, category, difficulty, target_year, description, full_description, flag_hash, points)
VALUES 
  ('Whois Lookup', 'OSINT', 'easy', '2025', 'Gather domain information', 'Use WHOIS to find publicly available information about a domain and extract the flag.', 'flag{whois_info_found}', 10),
  ('Subdomain Enumeration', 'OSINT', 'medium', '2025', 'Find hidden subdomains', 'Enumerate publicly known subdomains using OSINT techniques to locate a hidden flag.', 'flag{subdomains_found}', 25),
  ('GitHub Recon', 'OSINT', 'medium', '2025', 'Search GitHub for leaks', 'Search GitHub repositories for accidentally exposed secrets and find the flag.', 'flag{github_secret_exposed}', 25),
  ('Email Harvesting', 'OSINT', 'medium', '2025', 'Harvest email addresses', 'Find associated email addresses linked to a domain using public databases and search engines.', 'flag{emails_harvested}', 25),
  ('IP Geolocation', 'OSINT', 'medium', '2025', 'Locate IP address origin', 'Use IP geolocation databases to determine the physical location of a server and find the flag.', 'flag{ip_geolocation_found}', 25),
  ('Social Media Profiling', 'OSINT', 'hard', '2025', 'Profile a target on social media', 'Gather information from social media profiles to find sensitive data and extract the flag.', 'flag{profile_info_gathered}', 50),
  ('DNS History Investigation', 'OSINT', 'hard', '2025', 'Investigate DNS history', 'Use DNS history records to uncover historical information about a domain and find the flag.', 'flag{dns_history_uncovered}', 50);

-- Insert labs for selected challenges (using subqueries to get challenge IDs).
-- Uses ON CONFLICT to avoid duplicate labs if the script is re-run.
INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'sql-injection-101', 'web', true FROM challenges WHERE title = 'SQL Injection 101'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'xss-vulnerability', 'web', true FROM challenges WHERE title = 'XSS Vulnerability'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'csrf-attack', 'web', true FROM challenges WHERE title = 'CSRF Attack'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'caesar-cipher', 'crypto', true FROM challenges WHERE title = 'Caesar Cipher'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'rsa-encryption', 'crypto', true FROM challenges WHERE title = 'RSA Encryption'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'simple-binary', 'reverse', true FROM challenges WHERE title = 'Simple Binary'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'memory-analysis', 'forensics', true FROM challenges WHERE title = 'Memory Dump Analysis'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'packet-analysis', 'networking', true FROM challenges WHERE title = 'Packet Analysis'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'log-file-investigation', 'forensics', true FROM challenges WHERE title = 'Log File Investigation'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'disk-image-recovery', 'forensics', true FROM challenges WHERE title = 'Disk Image Recovery'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'whois-lookup', 'osint', true FROM challenges WHERE title = 'Whois Lookup'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'subdomain-enumeration', 'osint', true FROM challenges WHERE title = 'Subdomain Enumeration'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'github-recon', 'osint', true FROM challenges WHERE title = 'GitHub Recon'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'social-media-profiling', 'osint', true FROM challenges WHERE title = 'Social Media Profiling'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'dns-history-investigation', 'osint', true FROM challenges WHERE title = 'DNS History Investigation'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'email-harvesting', 'osint', true FROM challenges WHERE title = 'Email Harvesting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO labs (challenge_id, slug, lab_type, is_active)
SELECT id, 'ip-geolocation', 'osint', true FROM challenges WHERE title = 'IP Geolocation'
ON CONFLICT (slug) DO NOTHING;
