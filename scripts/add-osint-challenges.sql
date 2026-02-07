-- Add OSINT challenges if they don't exist
-- Run this script to add OSINT challenges to your database
-- OSINT (Open Source Intelligence) challenges
INSERT INTO
  challenges (
    title,
    category,
    difficulty,
    target_year,
    description,
    full_description,
    flag_hash,
    points
  )
SELECT
  *
FROM
  (
    VALUES
      (
        'Whois Lookup',
        'OSINT',
        'easy',
        '2025',
        'Gather domain information',
        'Use WHOIS to find publicly available information about a domain and extract the flag.',
        'flag{whois_info_found}',
        10
      ),
      (
        'Corporate Footprint Reconstruction',
        'OSINT',
        'medium',
        '2025',
        'Reconstruct a company''s registered office address from public records.',
        'A private aerospace company launched its first Falcon 9 rocket in 2010. Using open data only, determine the original registered office address of SpaceX at the time of that launch.',
        'flag{1_rocket_road_hawthorne_ca}',
        25
      ),
      (
        'Landmark + Timeline Correlation',
        'OSINT',
        'medium',
        '2025',
        'Correlate a landmark opening date and key engineer using public records.',
        'The iron landmark in Paris was opened in 1889. Using only open sources, identify the exact weekday the Eiffel Tower officially opened to the public, and name the chief engineer responsible for its construction.',
        'flag{monday_gustave_eiffel}',
        25
      ),
      (
        'Email Harvesting',
        'OSINT',
        'medium',
        '2025',
        'Harvest email addresses',
        'Find associated email addresses linked to a domain using public databases and search engines.',
        'flag{emails_harvested}',
        25
      ),
      (
        'Aviation + Open Registries',
        'OSINT',
        'medium',
        '2025',
        'Correlate flight tracker logs with registry data to identify an aircraft.',
        'A Boeing 777 made headlines after an emergency diversion in 2023. Using flight trackers and aircraft registries, identify the tail number of the Boeing 777 operated by United Airlines involved in that incident, plus its manufacture year.',
        'flag{n212ua_1995}',
        25
      ),
      (
        'Social Media Profiling',
        'OSINT',
        'hard',
        '2025',
        'Profile a target on social media',
        'Gather information from social media profiles to find sensitive data and extract the flag.',
        'flag{profile_info_gathered}',
        50
      ),
      (
        'Organizational Change Tracking',
        'OSINT',
        'hard',
        '2025',
        'Track leadership renewals at a global health body.',
        'A global health body updated its leadership during the COVID era. Using press releases and archived webpages, determine the month and year when the World Health Organization formally renewed its current Director-General''s term.',
        'flag{may_2022}',
        50
      )
  ) AS v (
    title,
    category,
    difficulty,
    target_year,
    description,
    full_description,
    flag_hash,
    points
  )
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      challenges
    WHERE
      challenges.title = v.title
  );