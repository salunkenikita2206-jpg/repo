SELECT *
FROM `clitech-503307.soil_project1.alpha_embeddings`
LIMIT 5;

SELECT *
FROM `clitech-503307.soil_project1.hwsd_extracted`
LIMIT 5;


SELECT
COUNT(*) AS alpha_rows
FROM
`clitech-503307.soil_project1.alpha_embeddings`;


SELECT
COUNT(*) AS hwsd_rows
FROM
`clitech-503307.soil_project1.hwsd_extracted`;
