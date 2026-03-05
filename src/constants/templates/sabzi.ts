/**
 * Sabzi Store Template - 35 common fruits & vegetables
 * Includes seasonal vegetables, fruits, herbs
 */
import type { TemplateItem } from '@models/Product';

export const sabziTemplate: TemplateItem[] = [
  // Leafy Vegetables (5 items)
  { id: 'spinach_1kg', name: 'Spinach 1kg', nameUrdu: 'پالک 1 کلو', category: 'vegetables', unit: 'bundle', suggestedPrice: 60 },
  { id: 'methi_1kg', name: 'Methi (Fenugreek) 1kg', nameUrdu: 'میتھی 1 کلو', category: 'vegetables', unit: 'bundle', suggestedPrice: 80 },
  { id: 'cabbage_1kg', name: 'Cabbage 1kg', nameUrdu: 'بندگوبھی 1 کلو', category: 'vegetables', unit: 'piece', suggestedPrice: 40 },
  { id: 'lettuce_500g', name: 'Lettuce 500g', nameUrdu: 'لیٹش 500 گرام', category: 'vegetables', unit: 'bundle', suggestedPrice: 70 },
  { id: 'coriander_fresh_250g', name: 'Fresh Coriander 250g', nameUrdu: 'تازہ دھنیا 250 گرام', category: 'vegetables', unit: 'bundle', suggestedPrice: 50 },

  // Root Vegetables (8 items)
  { id: 'carrot_1kg', name: 'Carrot 1kg', nameUrdu: 'گاجر 1 کلو', category: 'vegetables', unit: 'kg', suggestedPrice: 80 },
  { id: 'potato_5kg', name: 'Potato 5kg', nameUrdu: 'آلو 5 کلو', category: 'vegetables', unit: 'bag', suggestedPrice: 200 },
  { id: 'onion_5kg', name: 'Onion 5kg', nameUrdu: 'پیاز 5 کلو', category: 'vegetables', unit: 'bag', suggestedPrice: 300 },
  { id: 'garlic_500g', name: 'Garlic 500g', nameUrdu: 'لہسن 500 گرام', category: 'vegetables', unit: 'bunch', suggestedPrice: 120 },
  { id: 'ginger_500g', name: 'Ginger 500g', nameUrdu: 'ادرک 500 گرام', category: 'vegetables', unit: 'bunch', suggestedPrice: 100 },
  { id: 'turnip_1kg', name: 'Turnip 1kg', nameUrdu: 'شلغم 1 کلو', category: 'vegetables', unit: 'kg', suggestedPrice: 70 },
  { id: 'radish_1kg', name: 'Radish 1kg', nameUrdu: 'مولی 1 کلو', category: 'vegetables', unit: 'bundle', suggestedPrice: 50 },
  { id: 'beetroot_1kg', name: 'Beetroot 1kg', nameUrdu: 'چقندر 1 کلو', category: 'vegetables', unit: 'kg', suggestedPrice: 90 },

  // Vegetables (10 items)
  { id: 'tomato_1kg', name: 'Tomato 1kg', nameUrdu: 'ٹماٹر 1 کلو', category: 'vegetables', unit: 'kg', suggestedPrice: 120 },
  { id: 'cucumber_1kg', name: 'Cucumber 1kg', nameUrdu: 'خیار 1 کلو', category: 'vegetables', unit: 'kg', suggestedPrice: 80 },
  { id: 'eggplant_1kg', name: 'Eggplant 1kg', nameUrdu: 'بینگن 1 کلو', category: 'vegetables', unit: 'kg', suggestedPrice: 90 },
  { id: 'green_chilies_500g', name: 'Green Chillies 500g', nameUrdu: 'سبز مرچ 500 گرام', category: 'vegetables', unit: 'bunch', suggestedPrice: 80 },
  { id: 'bell_pepper_1kg', name: 'Bell Pepper 1kg', nameUrdu: 'شملہ مرچ 1 کلو', category: 'vegetables', unit: 'kg', suggestedPrice: 200 },
  { id: 'pumpkin_1kg', name: 'Pumpkin 1kg', nameUrdu: 'کدو 1 کلو', category: 'vegetables', unit: 'piece', suggestedPrice: 60 },
  { id: 'okra_500g', name: 'Okra 500g', nameUrdu: 'بھنڈی 500 گرام', category: 'vegetables', unit: 'bunch', suggestedPrice: 120 },
  { id: 'bitter_gourd_500g', name: 'Bitter Gourd 500g', nameUrdu: 'کریلا 500 گرام', category: 'vegetables', unit: 'piece', suggestedPrice: 100 },
  { id: 'bottle_gourd_1kg', name: 'Bottle Gourd 1kg', nameUrdu: 'لوکی 1 کلو', category: 'vegetables', unit: 'piece', suggestedPrice: 50 },
  { id: 'peas_500g', name: 'Green Peas 500g', nameUrdu: 'مٹر 500 گرام', category: 'vegetables', unit: 'pack', suggestedPrice: 100 },

  // Fruits (8 items)
  { id: 'banana_1kg', name: 'Banana 1kg', nameUrdu: 'کیلے 1 کلو', category: 'fruits', unit: 'dozen', suggestedPrice: 120 },
  { id: 'apple_red_1kg', name: 'Apple Red 1kg', nameUrdu: 'سرخ سیب 1 کلو', category: 'fruits', unit: 'kg', suggestedPrice: 350 },
  { id: 'orange_1kg', name: 'Orange 1kg', nameUrdu: 'نارنگی 1 کلو', category: 'fruits', unit: 'kg', suggestedPrice: 150 },
  { id: 'mango_1kg', name: 'Mango 1kg', nameUrdu: 'آم 1 کلو', category: 'fruits', unit: 'kg', suggestedPrice: 200 },
  { id: 'lemon_1kg', name: 'Lemon 1kg', nameUrdu: 'لیموں 1 کلو', category: 'fruits', unit: 'kg', suggestedPrice: 180 },
  { id: 'watermelon_1piece', name: 'Watermelon 1 piece', nameUrdu: 'تربوز 1 عدد', category: 'fruits', unit: 'piece', suggestedPrice: 250 },
  { id: 'pomegranate_4pieces', name: 'Pomegranate 4 pieces', nameUrdu: 'انار 4 عدد', category: 'fruits', unit: 'kg', suggestedPrice: 300 },
  { id: 'papaya_1kg', name: 'Papaya 1kg', nameUrdu: 'पपائتا 1 کلو', category: 'fruits', unit: 'kg', suggestedPrice: 180 },

  // Herbs & Spice Plants (4 items)
  { id: 'mint_fresh_250g', name: 'Fresh Mint 250g', nameUrdu: 'تازہ پودینہ 250 گرام', category: 'vegetables', unit: 'bunch', suggestedPrice: 40 },
  { id: 'basil_fresh_150g', name: 'Fresh Basil 150g', nameUrdu: 'تازہ تلسی 150 گرام', category: 'vegetables', unit: 'bunch', suggestedPrice: 60 },
  { id: 'chives_100g', name: 'Chives 100g', nameUrdu: 'پیاز کے پتے 100 گرام', category: 'vegetables', unit: 'bunch', suggestedPrice: 50 },
  { id: 'parsley_100g', name: 'Parsley 100g', nameUrdu: 'جعفری 100 گرام', category: 'vegetables', unit: 'bunch', suggestedPrice: 60 },
];
