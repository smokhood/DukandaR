/**
 * Bakery Template - 30 common items
 * Includes bread, pastries, cakes, cookies, baking supplies
 */
import type { TemplateItem } from '@models/Product';

export const bakeryTemplate: TemplateItem[] = [
  // Bread & Rotis (6 items)
  { id: 'white_bread_400g', name: 'White Bread 400g', nameUrdu: 'سفید روٹی 400 گرام', category: 'bread', unit: 'loaf', suggestedPrice: 120 },
  { id: 'brown_bread_400g', name: 'Brown Bread 400g', nameUrdu: 'سرمئی روٹی 400 گرام', category: 'bread', unit: 'loaf', suggestedPrice: 150 },
  { id: 'naan', name: 'Naan (2 pieces)', nameUrdu: 'نان (2 عدد)', category: 'bread', unit: 'pack', suggestedPrice: 80 },
  { id: 'roti_pack_5', name: 'Roti Pack (5 pieces)', nameUrdu: 'روٹی پیک (5 عدد)', category: 'bread', unit: 'pack', suggestedPrice: 60 },
  { id: 'puri_10', name: 'Puri (10 pieces)', nameUrду: 'پوری (10 عدد)', category: 'bread', unit: 'pack', suggestedPrice: 100 },
  { id: 'paratha_4', name: 'Paratha (4 pieces)', nameUrdu: 'پراٹھا (4 عدد)', category: 'bread', unit: 'pack', suggestedPrice: 120 },

  // Cake & Pastries (8 items)
  { id: 'choco_cake_250g', name: 'Chocolate Cake Slice 250g', nameUrdu: 'چاکلیٹ کیک 250 گرام', category: 'cakes_pastries', unit: 'piece', suggestedPrice: 200 },
  { id: 'vanilla_cake_250g', name: 'Vanilla Cake Slice 250g', nameUrdu: 'وینیلا کیک 250 گرام', category: 'cakes_pastries', unit: 'piece', suggestedPrice: 180 },
  { id: 'cupcake_choco', name: 'Chocolate Cupcake', nameUrdu: 'چاکلیٹ کپ کیک', category: 'cakes_pastries', unit: 'piece', suggestedPrice: 80 },
  { id: 'croissant', name: 'Croissant', nameUrdu: 'کروسنٹ', category: 'cakes_pastries', unit: 'piece', suggestedPrice: 100 },
  { id: 'danish_pastry', name: 'Danish Pastry', nameUrdu: 'ڈینش پیسٹری', category: 'cakes_pastries', unit: 'piece', suggestedPrice: 120 },
  { id: 'donut_plain', name: 'Donut Plain', nameUrdu: 'ڈونٹ سادہ', category: 'cakes_pastries', unit: 'piece', suggestedPrice: 60 },
  { id: 'donut_chocolate', name: 'Donut Chocolate', nameUrду: 'ڈونٹ چاکلیٹ', category: 'cakes_pastries', unit: 'piece', suggestedPrice: 80 },
  { id: 'cream_puff', name: 'Cream Puff', nameUrdu: 'کریم پف', category: 'cakes_pastries', unit: 'piece', suggestedPrice: 90 },

  // Cookies & Biscuits (6 items)
  { id: 'biscuit_chocolate_150g', name: 'Chocolate Biscuit 150g', nameUrdu: 'چاکلیٹ بسکٹ 150 گرام', category: 'cookies_biscuits', unit: 'pack', suggestedPrice: 100 },
  { id: 'butterbiscuit_150g', name: 'Butter Biscuit 150g', nameUrdu: 'مکھن بسکٹ 150 گرام', category: 'cookies_biscuits', unit: 'pack', suggestedPrice: 120 },
  { id: 'custard_biscuit_150g', name: 'Custard Biscuit 150g', nameUrdu: 'کسٹرڈ بسکٹ 150 گرام', category: 'cookies_biscuits', unit: 'pack', suggestedPrice: 110 },
  { id: 'digestive_biscuit_200g', name: 'Digestive Biscuit 200g', nameUrду: 'ہضم بسکٹ 200 گرام', category: 'cookies_biscuits', unit: 'pack', suggestedPrice: 140 },
  { id: 'almond_cookie_150g', name: 'Almond Cookie 150g', nameUrdu: 'بادام کی کوکیز 150 گرام', category: 'cookies_biscuits', unit: 'pack', suggestedPrice: 180 },
  { id: 'coconut_cookie_150g', name: 'Coconut Cookie 150g', nameUrду: 'ناریل کی کوکیز 150 گرام', category: 'cookies_biscuits', unit: 'pack', suggestedPrice: 170 },

  // Bakery Supplies (10 items)
  { id: 'flour_plain_1kg', name: 'Plain Flour 1kg', nameUrdu: 'میدہ 1 کلو', category: 'supplies', unit: 'pack', suggestedPrice: 100 },
  { id: 'flour_whole_wheat_1kg', name: 'Whole Wheat Flour 1kg', nameUrdu: 'سفید گندم کا آٹا 1 کلو', category: 'supplies', unit: 'pack', suggestedPrice: 120 },
  { id: 'baking_powder_100g', name: 'Baking Powder 100g', nameUrdu: 'بیکنگ پاؤڈر 100 گرام', category: 'supplies', unit: 'pack', suggestedPrice: 40 },
  { id: 'baking_soda_100g', name: 'Baking Soda 100g', nameUrdu: 'بیکنگ سوڈا 100 گرام', category: 'supplies', unit: 'pack', suggestedPrice: 30 },
  { id: 'yeast_instant_7g', name: 'Instant Yeast 7g', nameUrdu: 'فوری خمیر 7 گرام', category: 'supplies', unit: 'pack', suggestedPrice: 80 },
  { id: 'vanilla_extract_50ml', name: 'Vanilla Extract 50ml', nameUrdu: 'وینیلا عرق 50 ملی لیٹر', category: 'supplies', unit: 'bottle', suggestedPrice: 200 },
  { id: 'cocoa_powder_100g', name: 'Cocoa Powder 100g', nameUrdu: 'کوکو پاؤڈر 100 گرام', category: 'supplies', unit: 'pack', suggestedPrice: 150 },
  { id: 'food_coloring_20ml', name: 'Food Coloring 20ml', nameUrdu: 'غذا کرنے والا رنگ 20 ملی لیٹر', category: 'supplies', unit: 'bottle', suggestedPrice: 100 },
  { id: 'chocolate_chips_200g', name: 'Chocolate Chips 200g', nameUrду: 'چاکلیٹ کے ٹکڑے 200 گرام', category: 'supplies', unit: 'pack', suggestedPrice: 250 },
  { id: 'sprinkles_colorful_100g', name: 'Sprinkles Colorful 100g', nameUrdu: 'رنگین چھڑکنے والا 100 گرام', category: 'supplies', unit: 'pack', suggestedPrice: 120 },
];
