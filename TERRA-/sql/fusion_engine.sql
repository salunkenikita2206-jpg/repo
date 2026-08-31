CREATE OR REPLACE TABLE
`clitech-503307.soil_project1.infused_vectors`
AS

SELECT

a.cell_id,

a.latitude,
a.longitude,

a.A00,
a.A01,
a.A02,
a.A03,
a.A04,
a.A05,
a.A06,
a.A07,
a.A08,
a.A09,
a.A10,
a.A11,
a.A12,
a.A13,
a.A14,
a.A15,
a.A16,
a.A17,
a.A18,
a.A19,
a.A20,
a.A21,
a.A22,
a.A23,
a.A24,
a.A25,
a.A26,
a.A27,
a.A28,
a.A29,
a.A30,
a.A31,
a.A32,
a.A33,
a.A34,
a.A35,
a.A36,
a.A37,
a.A38,
a.A39,
a.A40,
a.A41,
a.A42,
a.A43,
a.A44,
a.A45,
a.A46,
a.A47,
a.A48,
a.A49,
a.A50,
a.A51,
a.A52,
a.A53,
a.A54,
a.A55,
a.A56,
a.A57,
a.A58,
a.A59,
a.A60,
a.A61,
a.A62,
a.A63,

h.OC_D1,
h.TOTN_D1,
h.BULK_D1,
h.SAND_D1,
h.SILT_D1,
h.CLAY_D1

FROM
`clitech-503307.soil_project1.alpha_embeddings` a

INNER JOIN

`clitech-503307.soil_project1.hwsd_extracted` h

ON a.cell_id = h.cell_id;
