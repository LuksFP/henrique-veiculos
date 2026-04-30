insert into public.vehicles
  (make, model, year, km, fuel, transmission, color, price, options, image_path, bg, is_featured, sort_order)
values
  ('FIAT', 'ARGO 1.0 FIREFLY FLEX DRIVE MANUAL', 2025, '44.109', 'FLEX', 'MANUAL', 'BRANCO', 'R$ 75.990,00', array['ABS','Airbag','Ar-condicionado','Outros opcionais'], '/assets/vehicles/fiat-argo-ai.png', 'linear-gradient(135deg, #f4f4f5, #a1a1aa)', true, 1),
  ('HYUNDAI', 'HB20S 1.0 M COMFORT', 2025, '37.927', 'FLEX', 'MANUAL', 'PRATA', 'R$ 83.990,00', array['ABS','Airbag','Ar-condicionado','Outros opcionais'], '/assets/vehicles/hyundai-hb20s-ai.png', 'linear-gradient(135deg, #9ca3af, #3f3f46)', true, 2),
  ('HONDA', 'PCX 160 DLX ABS', 2025, '1.600', 'GASOLINA', 'AUTOMATICO', 'BRANCO', 'R$ 21.990,00', array['Outros opcionais'], '/assets/vehicles/honda-pcx-ai.png', 'linear-gradient(135deg, #f8fafc, #64748b)', true, 3),
  ('HYUNDAI', 'HB20 1.0 CONFOR', 2025, '43.848', 'FLEX', 'MANUAL', 'CINZA', 'R$ Consulte', array['Outros opcionais'], '/assets/vehicles/hyundai-hb20-ai.png', 'linear-gradient(135deg, #71717a, #18181b)', false, 4),
  ('HONDA', 'BIZ 125', 2024, '12.394', 'FLEX', 'MANUAL', 'BRANCO', 'R$ 17.490,00', array['Outros opcionais'], '/assets/vehicles/honda-biz-ai.png', 'linear-gradient(135deg, #f5f5f4, #78716c)', false, 5),
  ('CHEVROLET', 'ONIX 1.0 TURBO FLEX PLUS LT MANUAL', 2023, '24.000', 'FLEX', 'MANUAL', 'CINZA', 'R$ 74.990,00', array['ABS','Airbag','Ar-condicionado'], '/assets/vehicles/chevrolet-onix-ai.png', 'linear-gradient(135deg, #6b7280, #111827)', false, 6),
  ('HONDA', 'BIZ 125 +', 2022, '23.335', 'FLEX', 'MANUAL', 'BRANCO', 'R$ 15.990,00', array['Outros opcionais'], '/assets/vehicles/honda-biz-ai.png', 'linear-gradient(135deg, #fafafa, #737373)', false, 7),
  ('FIAT', 'NOVA STRADA FREEDOM CP 1.3', 2021, '76.526', 'FLEX', 'MANUAL', 'PRETO', 'R$ 75.990,00', array['Outros opcionais'], '/assets/vehicles/fiat-strada-ai.png', 'linear-gradient(135deg, #1f2937, #020617)', false, 8),
  ('VOLKSWAGEN', 'FOX 1.6 MSI TOTAL FLEX XTREME 4P MANUAL', 2020, '62.687', 'FLEX', 'MANUAL', 'PRETO', 'R$ 69.900,00', array['Outros opcionais'], '/assets/vehicles/volkswagen-fox-ai.png', 'linear-gradient(135deg, #27272a, #09090b)', false, 9),
  ('HYUNDAI', 'CRETA 1.6 16V FLEX ATTITUDE AUT', 2020, '70.330', 'FLEX', 'AUTOMATICO', 'PRATA', 'R$ 86.990,00', array['Outros opcionais'], '/assets/vehicles/hyundai-creta-ai.png', 'linear-gradient(135deg, #a1a1aa, #27272a)', false, 10),
  ('CHEVROLET', 'ONIX HATCH LT 1.0 12V TB FLEX 5P AUT.', 2020, '78.000', 'FLEX', 'AUTOMATICO', 'CINZA', 'R$ 68.990,00', array['Outros opcionais'], '/assets/vehicles/chevrolet-onix-ai.png', 'linear-gradient(135deg, #52525b, #18181b)', false, 11),
  ('VOLKSWAGEN', 'NOVA SAVEIRO TL MBVS', 2019, '83.281', 'FLEX', 'MANUAL', 'BRANCO', 'R$ 63.990,00', array['Outros opcionais'], '/assets/vehicles/volkswagen-saveiro-ai.png', 'linear-gradient(135deg, #f4f4f5, #71717a)', false, 12),
  ('VOLKSWAGEN', 'FOX 1.6 MI XTREME 4P', 2018, null, 'FLEX', 'MANUAL', null, 'R$ 64.990,00', '{}', '/assets/vehicles/volkswagen-fox-ai.png', 'linear-gradient(135deg, #404040, #171717)', false, 13),
  ('SUZUKI', 'JIMNY 4SUN 1.3 16V', 2015, null, 'GASOLINA', 'MANUAL', null, 'R$ 69.999,99', '{}', null, 'linear-gradient(135deg, #57534e, #1c1917)', false, 14),
  ('CHEVROLET', 'SPIN 1.8 LT 8V FLEX 4P AUTOMATICO', 2015, null, 'FLEX', 'AUTOMATICO', null, 'R$ 49.990,00', '{}', '/assets/vehicles/chevrolet-spin-ai.png', 'linear-gradient(135deg, #78716c, #292524)', false, 15),
  ('FIAT', 'PALIO ATTRACT 1.4', 2013, null, 'FLEX', 'MANUAL', null, 'R$ 39.990,00', '{}', null, 'linear-gradient(135deg, #d6d3d1, #57534e)', false, 16),
  ('CHEVROLET', 'CLASSIC', 2010, null, 'FLEX', 'MANUAL', null, 'R$ 24.990,00', '{}', null, 'linear-gradient(135deg, #a8a29e, #44403c)', false, 17),
  ('WILLYS', 'JEEP', 1956, null, 'GASOLINA', 'MANUAL', null, 'R$ 30.000,00', '{}', null, 'linear-gradient(135deg, #365314, #1a2e05)', false, 18);
