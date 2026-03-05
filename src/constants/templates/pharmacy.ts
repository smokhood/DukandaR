/**
 * Pharmacy Template - 45 common items
 * Includes OTC medicines, vitamins, pain relievers, antibiotics, digestives, first aid
 */
import type { TemplateItem } from '@models/Product';

export const pharmacyTemplate: TemplateItem[] = [
  // Pain Relievers (6 items)
  { id: 'aspirin_10tab', name: 'Aspirin 500mg (10tab)', nameUrdu: 'ایسپرین 500 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 40 },
  { id: 'paracetamol_10tab', name: 'Paracetamol 500mg (10tab)', nameUrdu: 'پیراسیٹامول 500 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 35 },
  { id: 'ibuprofen_10tab', name: 'Ibuprofen 400mg (10tab)', nameUrdu: 'آئی بریوفین 400 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 50 },
  { id: 'naproxen_10tab', name: 'Naproxen 250mg (10tab)', nameUrdu: 'نیپروکسین 250 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 45 },
  { id: 'voltaren_10tab', name: 'Voltaren 50mg (10tab)', nameUrdu: 'والٹرین 50 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 150 },
  { id: 'brufen_200ml', name: 'Brufen Syrup 200ml', nameUrdu: 'بروفین سائپ 200 ملی لیٹر', category: 'medicines', unit: 'bottle', suggestedPrice: 180 },

  // Antibiotics (7 items)
  { id: 'amoxicillin_10tab', name: 'Amoxicillin 500mg (10tab)', nameUrdu: 'اموکسیسلن 500 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 120 },
  { id: 'azithromycin_6tab', name: 'Azithromycin 500mg (6tab)', nameUrdu: 'ایزتھرومائسن 500 ملی گرام (6 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 200 },
  { id: 'ciprofloxacin_10tab', name: 'Ciprofloxacin 500mg (10tab)', nameUrdu: 'سپروفلاکسسن 500 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 150 },
  { id: 'cephalexin_10tab', name: 'Cephalexin 500mg (10tab)', nameUrdu: 'سیفیلیکسن 500 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 140 },
  { id: 'augmentin_10tab', name: 'Augmentin 625mg (10tab)', nameUrdu: 'آگمنٹن 625 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 280 },
  { id: 'metronidazole_10tab', name: 'Metronidazole 400mg (10tab)', nameUrdu: 'میٹرونڈازول 400 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 80 },
  { id: 'erythromycin_10tab', name: 'Erythromycin 500mg (10tab)', nameUrdu: 'ایریتھرومائسن 500 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 100 },

  // Digestives & Antacids (5 items)
  { id: 'nexium_20mg_10tab', name: 'Nexium 20mg (10tab)', nameUrdu: 'نیکسئیم 20 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 180 },
  { id: 'eno_100g', name: 'ENO Powder 100g', nameUrdu: 'ای ان او 100 گرام', category: 'medicines', unit: 'pack', suggestedPrice: 90 },
  { id: 'antacid_liquid_200ml', name: 'Antacid Suspension 200ml', nameUrdu: 'اینٹاسڈ معلق 200 ملی لیٹر', category: 'medicines', unit: 'bottle', suggestedPrice: 120 },
  { id: 'loperamide_10tab', name: 'Loperamide 2mg (10tab)', nameUrdu: 'لوپیرامائڈ 2 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 60 },
  { id: 'motilium_10tab', name: 'Motilium 10mg (10tab)', nameUrdu: 'موٹیلیم 10 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 140 },

  // Cold & Cough (5 items)
  { id: 'benadryl_100ml', name: 'Benadryl Cough Syrup 100ml', nameUrdu: 'بیناڈریل کھانسی کی شربت 100 ملی لیٹر', category: 'medicines', unit: 'bottle', suggestedPrice: 140 },
  { id: 'strepsils_10lozenges', name: 'Strepsils Lozenges (10)', nameUrdu: 'سٹریپسلز لوزنجز (10)', category: 'medicines', unit: 'pack', suggestedPrice: 120 },
  { id: 'coughex_100ml', name: 'Coughex Syrup 100ml', nameUrdu: 'کافیکس شربت 100 ملی لیٹر', category: 'medicines', unit: 'bottle', suggestedPrice: 130 },
  { id: 'decongest_100ml', name: 'Decongest Liquid 100ml', nameUrdu: 'ڈیکنجسٹ مائع 100 ملی لیٹر', category: 'medicines', unit: 'bottle', suggestedPrice: 110 },
  { id: 'vitamin_c_1000mg_10tab', name: 'Vitamin C 1000mg (10tab)', nameUrdu: 'وٹامن سی 1000 ملی گرام (10 ٹیبلٹ)', category: 'vitamins', unit: 'strip', suggestedPrice: 100 },

  // Vitamins & Supplements (8 items)
  { id: 'vitamin_b_complex_10tab', name: 'Vitamin B Complex (10tab)', nameUrdu: 'وٹامن بی کمپلیکس (10 ٹیبلٹ)', category: 'vitamins', unit: 'strip', suggestedPrice: 80 },
  { id: 'vitamin_d3_10tab', name: 'Vitamin D3 400IU (10tab)', nameUrdu: 'وٹامن ڈی 3 400 یو آئی (10 ٹیبلٹ)', category: 'vitamins', unit: 'strip', suggestedPrice: 90 },
  { id: 'iron_supplement_10tab', name: 'Iron Supplement (10tab)', nameUrdu: 'آئرن سپلیمنٹ (10 ٹیبلٹ)', category: 'vitamins', unit: 'strip', suggestedPrice: 70 },
  { id: 'calcium_citrate_10tab', name: 'Calcium Citrate (10tab)', nameUrdu: 'کیلشیم سائٹریٹ (10 ٹیبلٹ)', category: 'vitamins', unit: 'strip', suggestedPrice: 100 },
  { id: 'zinc_30mg_10tab', name: 'Zinc 30mg (10tab)', nameUrdu: 'زنک 30 ملی گرام (10 ٹیبلٹ)', category: 'vitamins', unit: 'strip', suggestedPrice: 110 },
  { id: 'turmeric_500mg_10tab', name: 'Turmeric Curcumin (10tab)', nameUrdu: 'ہلدی کرکومن (10 ٹیبلٹ)', category: 'vitamins', unit: 'strip', suggestedPrice: 85 },
  { id: 'multivitamin_10tab', name: 'Multivitamin 10tab', nameUrdu: 'ملٹی وٹامن 10 ٹیبلٹ', category: 'vitamins', unit: 'strip', suggestedPrice: 120 },
  { id: 'omega3_softgel_10cap', name: 'Omega-3 Fish Oil (10cap)', nameUrdu: 'اومیگا 3 مچھلی کا تیل (10 کیپسول)', category: 'vitamins', unit: 'strip', suggestedPrice: 200 },

  // Allergy & Antihistamine (3 items)
  { id: 'cetirizine_10tab', name: 'Cetirizine 10mg (10tab)', nameUrdu: 'سیٹریزائن 10 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 80 },
  { id: 'loratadine_10tab', name: 'Loratadine 10mg (10tab)', nameUrdu: 'لوریٹادائن 10 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 90 },
  { id: 'pheniramine_10tab', name: 'Pheniramine 25mg (10tab)', nameUrdu: 'فینرامن 25 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 50 },

  // Topical/Creams (4 items)
  { id: 'bacitracin_50g', name: 'Neosporin/Bacitracin 50g', nameUrdu: 'نیوسپورن 50 گرام', category: 'medicines', unit: 'tube', suggestedPrice: 150 },
  { id: 'calamine_lotion_100ml', name: 'Calamine Lotion 100ml', nameUrdu: 'کیلامین لوشن 100 ملی لیٹر', category: 'medicines', unit: 'bottle', suggestedPrice: 90 },
  { id: 'fungal_cream_20g', name: 'Miconazole Cream 20g', nameUrdu: 'مائکونازول کریم 20 گرام', category: 'medicines', unit: 'tube', suggestedPrice: 120 },
  { id: 'hydrocortisone_15g', name: 'Hydrocortisone Cream 15g', nameUrdu: 'ہائڈروکارٹوسون کریم 15 گرام', category: 'medicines', unit: 'tube', suggestedPrice: 180 },

  // Blood Pressure & Cardiac (2 items)
  { id: 'amlodipine_10tab', name: 'Amlodipine 5mg (10tab)', nameUrdu: 'املودپین 5 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 200 },
  { id: 'metoprolol_10tab', name: 'Metoprolol 50mg (10tab)', nameUrdu: 'میٹوپرولول 50 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 180 },

  // Diabetes (1 item)
  { id: 'metformin_10tab', name: 'Metformin 500mg (10tab)', nameUrdu: 'میٹفورمن 500 ملی گرام (10 ٹیبلٹ)', category: 'medicines', unit: 'strip', suggestedPrice: 90 },

  // First Aid Supplies (4 items)
  { id: 'cotton_wool', name: 'Cotton Wool 100g', nameUrdu: 'کپاس 100 گرام', category: 'medicines', unit: 'pack', suggestedPrice: 120 },
  { id: 'gauze_pad', name: 'Gauze Pads (10 pack)', nameUrdu: 'گاز پیڈز (10 پیک)', category: 'medicines', unit: 'pack', suggestedPrice: 150 },
  { id: 'adhesive_tape', name: 'Adhesive Tape Roll', nameUrdu: 'چپکنے والا ٹیپ رول', category: 'medicines', unit: 'roll', suggestedPrice: 50 },
  { id: 'bandages_10pack', name: 'Bandages Assorted (10)', nameUrdu: 'مختلف پٹیاں (10)', category: 'medicines', unit: 'pack', suggestedPrice: 80 },
];
