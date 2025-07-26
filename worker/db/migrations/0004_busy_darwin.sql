-- Custom SQL migration file, put your code below! --

-- Seed master_categories with charitable donation categories
-- Categories for trading fees to be donated to charitable causes

INSERT INTO `master_categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
-- Environmental & Climate
('env-protection', 'Environmental Protection', datetime('now'), datetime('now')),
('wildlife-conservation', 'Wildlife Conservation', datetime('now'), datetime('now')),
('clean-energy', 'Clean Energy', datetime('now'), datetime('now')),

-- Health & Medical
('medical-research', 'Medical Research', datetime('now'), datetime('now')),
('mental-health', 'Mental Health', datetime('now'), datetime('now')),
('healthcare-access', 'Healthcare Access', datetime('now'), datetime('now')),

-- Education & Technology
('education', 'Education', datetime('now'), datetime('now')),
('digital-literacy', 'Digital Literacy', datetime('now'), datetime('now')),
('stem-education', 'STEM Education', datetime('now'), datetime('now')),

-- Social Causes
('poverty-alleviation', 'Poverty Alleviation', datetime('now'), datetime('now')),
('food-security', 'Food Security', datetime('now'), datetime('now')),
('housing-shelter', 'Housing & Shelter', datetime('now'), datetime('now')),
('human-rights', 'Human Rights', datetime('now'), datetime('now')),

-- Community & Development
('community-development', 'Community Development', datetime('now'), datetime('now')),
('disaster-relief', 'Disaster Relief', datetime('now'), datetime('now')),
('children-youth', 'Children & Youth', datetime('now'), datetime('now')),

-- Special Populations
('veterans-support', 'Veterans Support', datetime('now'), datetime('now')),
('elderly-care', 'Elderly Care', datetime('now'), datetime('now')),
('disability-support', 'Disability Support', datetime('now'), datetime('now')),

-- Animals
('animal-welfare', 'Animal Welfare', datetime('now'), datetime('now')),

-- Arts & Culture
('arts-culture', 'Arts & Culture', datetime('now'), datetime('now')),

-- Technology for Good
('open-source', 'Open Source', datetime('now'), datetime('now')),
('blockchain-for-good', 'Blockchain for Good', datetime('now'), datetime('now'));