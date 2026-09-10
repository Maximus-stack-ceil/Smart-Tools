import React from 'react';
import { CategoryId, FAQItem } from '../types';

// Implementation imports
import { PercentageCalculator } from '../components/tools/implementations/PercentageCalculator';
import { AgeCalculator } from '../components/tools/implementations/AgeCalculator';
import { LoanCalculator } from '../components/tools/implementations/LoanCalculator';
import { BmiCalculator } from '../components/tools/implementations/BmiCalculator';
import { WordCounter } from '../components/tools/implementations/WordCounter';
import { CaseConverter } from '../components/tools/implementations/CaseConverter';
import { QrCodeGenerator } from '../components/tools/implementations/QrCodeGenerator';
import { PasswordGenerator } from '../components/tools/implementations/PasswordGenerator';
import { JsonFormatter } from '../components/tools/implementations/JsonFormatter';
import { Base64Tool } from '../components/tools/implementations/Base64Tool';
import { UnitConverter } from '../components/tools/implementations/UnitConverter';
import { DateDifference } from '../components/tools/implementations/DateDifference';
import { UuidGenerator } from '../components/tools/implementations/UuidGenerator';
import { ColorConverter } from '../components/tools/implementations/ColorConverter';
import { ImageConverter } from '../components/tools/implementations/ImageConverter';
import { DiscountCalculator } from '../components/tools/implementations/DiscountCalculator';
import { TipCalculator } from '../components/tools/implementations/TipCalculator';
import { SimpleInterestCalculator } from '../components/tools/implementations/SimpleInterestCalculator';
import { CompoundInterestCalculator } from '../components/tools/implementations/CompoundInterestCalculator';
import { SavingsCalculator } from '../components/tools/implementations/SavingsCalculator';
import { CountdownTimer } from '../components/tools/implementations/CountdownTimer';
import { TimeZoneConverter } from '../components/tools/implementations/TimeZoneConverter';
import { IdealWeightCalculator } from '../components/tools/implementations/IdealWeightCalculator';
import { WaterIntakeCalculator } from '../components/tools/implementations/WaterIntakeCalculator';
import { CalorieCalculator } from '../components/tools/implementations/CalorieCalculator';
import { CharacterCounter } from '../components/tools/implementations/CharacterCounter';
import { SentenceCounter } from '../components/tools/implementations/SentenceCounter';
import { RemoveDuplicateLines } from '../components/tools/implementations/RemoveDuplicateLines';
import { TextCleaner } from '../components/tools/implementations/TextCleaner';
import { JsonValidator } from '../components/tools/implementations/JsonValidator';
import { UrlEncoderDecoder } from '../components/tools/implementations/UrlEncoderDecoder';
import { UnixTimestampConverter } from '../components/tools/implementations/UnixTimestampConverter';
import { RandomNumberGenerator } from '../components/tools/implementations/RandomNumberGenerator';
import { UsernameGenerator } from '../components/tools/implementations/UsernameGenerator';
import { ImageCompressor } from '../components/tools/implementations/ImageCompressor';
import { ImageResizer } from '../components/tools/implementations/ImageResizer';
import { JpgToPng } from '../components/tools/implementations/JpgToPng';
import { PngToJpg } from '../components/tools/implementations/PngToJpg';
import { ImageCropper } from '../components/tools/implementations/ImageCropper';

export interface ToolMeta {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  categoryId: CategoryId; // Alias for backward compatibility
  shortDescription: string;
  fullDescription: string;
  keywords: string[];
  tags: string[]; // Alias for backward compatibility
  seoTitle: string;
  seoDescription: string;
  icon: string;
  iconName: string; // Alias for backward compatibility
  component: React.ComponentType<any>;
  relatedToolSlugs: string[];
  isPopular?: boolean;
  howToUse: string[];
  howItWorks: string;
  faqs: FAQItem[];
}

export const TOOL_REGISTRY: ToolMeta[] = [
  // 1. Percentage Calculator
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'finance',
    categoryId: 'finance',
    shortDescription: 'Calculate percentages, percent differences, and value increases or decreases in seconds.',
    fullDescription: 'Solve any percentage problem instantly: find what percentage one number is of another, compute percentage increase or decrease, or calculate percentage of a total amount.',
    keywords: ['percentage', 'math', 'finance', 'discount', 'markup', 'change'],
    tags: ['percentage', 'math', 'finance', 'discount', 'markup', 'change'],
    seoTitle: 'Percentage Calculator — Quick, Accurate & Free | SmartTools',
    seoDescription: 'Free percentage calculator for daily calculations, discounts, and percentage difference. Fast and runs 100% in your browser.',
    icon: 'Percent',
    iconName: 'Percent',
    component: PercentageCalculator,
    isPopular: true,
    howToUse: [
      'Select the calculation mode: What is X% of Y, Percentage difference, or X is what % of Y.',
      'Enter your values into the designated input fields.',
      'Click Calculate or observe the instant calculated output below.',
      'Use Copy Result or Copy Link to save or share the exact calculation state.',
    ],
    howItWorks: 'The basic percentage formula multiplies the base number by the percentage fraction (P / 100). For percentage change, the formula calculates ((New Value - Old Value) / Old Value) * 100.',
    faqs: [
      { question: 'How do you calculate percentage increase?', answer: 'Subtract the original value from the new value, divide that difference by the original value, and multiply by 100.' },
      { question: 'Can I calculate negative percentages?', answer: 'Yes, entering lower subsequent values automatically indicates a negative percentage change.' },
    ],
    relatedToolSlugs: ['discount-calculator', 'loan-calculator', 'tip-calculator'],
  },

  // 2. Age Calculator
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'datetime',
    categoryId: 'datetime',
    shortDescription: 'Find exact chronological age in years, months, days, total hours, and next birthday countdown.',
    fullDescription: 'Calculate your exact age with precision. Discover how many years, months, and days you have lived, along with total elapsed weeks, days, hours, and an exact countdown to your next birthday.',
    keywords: ['age', 'birthday', 'date', 'chronological', 'years', 'calendar'],
    tags: ['age', 'birthday', 'date', 'chronological', 'years', 'calendar'],
    seoTitle: 'Age Calculator — Exact Chronological Age & Birthday Countdown | SmartTools',
    seoDescription: 'Accurately calculate your exact age in years, months, days, and hours, plus next birthday countdown.',
    icon: 'Cake',
    iconName: 'Cake',
    component: AgeCalculator,
    isPopular: true,
    howToUse: [
      'Select your birth date using the calendar input.',
      'Optionally adjust the "Age at the Date of" target (defaults to today).',
      'Click Calculate Age to reveal the detailed chronological breakdown.',
    ],
    howItWorks: 'Computes Gregorian calendar discrepancies including leap years and exact month boundaries to ensure mathematically accurate calendar year and day balances.',
    faqs: [
      { question: 'Does this calculator account for leap years?', answer: 'Yes, leap years (366 days with February 29th) are fully accounted for.' },
    ],
    relatedToolSlugs: ['date-difference-calculator', 'countdown-timer', 'time-zone-converter'],
  },

  // 3. Loan Calculator
  {
    id: 'loan-calculator',
    slug: 'loan-calculator',
    name: 'Loan & Mortgage Calculator',
    category: 'finance',
    categoryId: 'finance',
    shortDescription: 'Estimate monthly loan repayments, total interest payable, and amortization schedules.',
    fullDescription: 'Plan your borrowing with confidence. Calculate monthly payments, total interest costs, and amortization schedules for mortgages, auto loans, or personal financing.',
    keywords: ['loan', 'mortgage', 'interest', 'amortization', 'finance', 'emi'],
    tags: ['loan', 'mortgage', 'interest', 'amortization', 'finance', 'emi'],
    seoTitle: 'Loan & Mortgage Calculator — Monthly Payments & Interest | SmartTools',
    seoDescription: 'Calculate monthly loan and mortgage payments, total interest costs, and full amortization breakdown.',
    icon: 'Landmark',
    iconName: 'Landmark',
    component: LoanCalculator,
    isPopular: true,
    howToUse: [
      'Enter the total principal loan amount.',
      'Input the annual interest rate percentage.',
      'Specify the loan term in years or months.',
      'Review your monthly payment and total interest cost.',
    ],
    howItWorks: 'Utilizes standard annuity amortization equations: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ].',
    faqs: [
      { question: 'What is an amortization schedule?', answer: 'It is a breakdown showing how much of each payment goes toward the principal versus interest over the life of the loan.' },
    ],
    relatedToolSlugs: ['percentage-calculator', 'compound-interest-calculator', 'simple-interest-calculator'],
  },

  // 4. BMI Calculator
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'health',
    categoryId: 'health',
    shortDescription: 'Check Body Mass Index with metric and imperial measurements according to WHO standards.',
    fullDescription: 'Compute your Body Mass Index (BMI) using standard World Health Organization criteria. Supports both metric (kg/cm) and imperial (lbs/inches) units with visual health weight ranges.',
    keywords: ['bmi', 'body mass index', 'health', 'fitness', 'weight', 'metric', 'imperial'],
    tags: ['bmi', 'body mass index', 'health', 'fitness', 'weight', 'metric', 'imperial'],
    seoTitle: 'BMI Calculator — Free Body Mass Index & Healthy Weight Range | SmartTools',
    seoDescription: 'Check your Body Mass Index (BMI) instantly. Supports metric and imperial measurements with WHO classifications.',
    icon: 'Activity',
    iconName: 'Activity',
    component: BmiCalculator,
    isPopular: true,
    howToUse: [
      'Select Metric (cm, kg) or Imperial (ft/in, lbs).',
      'Enter your height and current body weight.',
      'View your BMI score, category, and healthy weight range.',
    ],
    howItWorks: 'Calculated by dividing weight in kilograms by the square of height in meters (kg / m²).',
    faqs: [
      { question: 'What is a normal BMI?', answer: 'The WHO considers a BMI between 18.5 and 24.9 as normal/healthy weight.' },
    ],
    relatedToolSlugs: ['ideal-weight-calculator', 'calorie-calculator', 'water-intake-calculator'],
  },

  // 5. Word Counter
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word & Character Counter',
    category: 'text',
    categoryId: 'text',
    shortDescription: 'Count words, characters, sentences, paragraphs, and estimate reading time in real-time.',
    fullDescription: 'Analyze your writing instantly. Count words, characters (with and without spaces), sentences, paragraphs, and calculate estimated reading and speaking times.',
    keywords: ['word counter', 'character count', 'reading time', 'text editor', 'writing', 'copywriting'],
    tags: ['word counter', 'character count', 'reading time', 'text editor', 'writing', 'copywriting'],
    seoTitle: 'Word Counter — Real-Time Word & Character Count | SmartTools',
    seoDescription: 'Fast, free word counter and character counter. Check words, letters, sentences, reading time, and social limits.',
    icon: 'FileText',
    iconName: 'FileText',
    component: WordCounter,
    isPopular: true,
    howToUse: [
      'Type or paste your text into the editor.',
      'Review live updated statistics immediately.',
      'Check reading time and social media length limits.',
    ],
    howItWorks: 'Analyzes string patterns and regex word boundary tokens on client-side keypress events.',
    faqs: [
      { question: 'Is my text private?', answer: 'Yes, all text analysis is processed locally in your browser memory.' },
    ],
    relatedToolSlugs: ['character-counter', 'sentence-counter', 'case-converter'],
  },

  // 6. Case Converter
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: 'Text Case Converter',
    category: 'text',
    categoryId: 'text',
    shortDescription: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.',
    fullDescription: 'Transform text into any casing convention in one click. Perfect for writers, developers, and data cleanup.',
    keywords: ['case converter', 'uppercase', 'lowercase', 'camelcase', 'snake_case', 'title case', 'kebab-case'],
    tags: ['case converter', 'uppercase', 'lowercase', 'camelcase', 'snake_case', 'title case', 'kebab-case'],
    seoTitle: 'Text Case Converter — Title Case, CamelCase, Uppercase | SmartTools',
    seoDescription: 'Convert text between uppercase, lowercase, title case, camelCase, snake_case, and kebab-case instantly.',
    icon: 'Type',
    iconName: 'Type',
    component: CaseConverter,
    isPopular: false,
    howToUse: ['Paste your text into the input field.', 'Click the casing style button to apply.', 'Click Copy to save the formatted result.'],
    howItWorks: 'Uses string split tokens and regex replacement rules for title casing and code casing conventions.',
    faqs: [{ question: 'What is kebab-case?', answer: 'Kebab-case replaces spaces with hyphens, commonly used in URLs and CSS class names.' }],
    relatedToolSlugs: ['word-counter', 'text-cleaner', 'remove-duplicate-lines'],
  },

  // 7. QR Code Generator
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'generators',
    categoryId: 'generators',
    shortDescription: 'Create high-resolution QR codes for websites, plain text, Wi-Fi networks, and contact info.',
    fullDescription: 'Generate customized, high-resolution QR codes right inside your browser. Download in PNG format with customizable error correction levels.',
    keywords: ['qr code', 'generator', 'wifi qr', 'url qr', 'barcode', 'download qr'],
    tags: ['qr code', 'generator', 'wifi qr', 'url qr', 'barcode', 'download qr'],
    seoTitle: 'Free QR Code Generator — High Resolution & Downloadable | SmartTools',
    seoDescription: 'Create custom QR codes for URLs, WiFi, plain text, and contacts. Instant, free, and downloadable in PNG.',
    icon: 'QrCode',
    iconName: 'QrCode',
    component: QrCodeGenerator,
    isPopular: true,
    howToUse: ['Select content type (URL, Text, or Wi-Fi).', 'Enter your link or credentials.', 'Download the generated QR code.'],
    howItWorks: 'Uses the qrcode matrix algorithm rendered onto an HTML5 Canvas completely offline.',
    faqs: [{ question: 'Do these QR codes expire?', answer: 'No! They are static QR codes that encode your data directly and never expire.' }],
    relatedToolSlugs: ['password-generator', 'image-converter', 'base64-tool'],
  },

  // 8. Password Generator
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Secure Password Generator',
    category: 'generators',
    categoryId: 'generators',
    shortDescription: 'Generate strong, cryptographically secure passwords and memorable passphrases with entropy scores.',
    fullDescription: 'Create unbreakable passwords using cryptographically secure pseudorandom numbers (CSPRNG). Includes entropy score and strength ratings.',
    keywords: ['password generator', 'secure password', 'entropy', 'passphrase', 'random password'],
    tags: ['password generator', 'secure password', 'entropy', 'passphrase', 'random password'],
    seoTitle: 'Strong Password Generator — Cryptographically Secure | SmartTools',
    seoDescription: 'Generate ultra-secure passwords using window.crypto CSPRNG. Safe, private, with live entropy evaluation.',
    icon: 'KeyRound',
    iconName: 'KeyRound',
    component: PasswordGenerator,
    isPopular: true,
    howToUse: ['Select password length (8 to 64 chars).', 'Toggle uppercase, lowercase, numbers, and symbols.', 'Click Copy Password.'],
    howItWorks: 'Uses window.crypto.getRandomValues for unbiased, cryptographically strong randomness.',
    faqs: [{ question: 'Can anyone intercept my generated password?', answer: 'No. The password is generated in your browser tab without any network transmission.' }],
    relatedToolSlugs: ['uuid-generator', 'qr-code-generator', 'random-number-generator'],
  },

  // 9. JSON Formatter
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Beautifier',
    category: 'developer',
    categoryId: 'developer',
    shortDescription: 'Beautify, validate, and minify JSON payloads with syntax error detection and copy actions.',
    fullDescription: 'Validate and format messy JSON strings with customized indentation. Identifies parse errors with exact character positions.',
    keywords: ['json formatter', 'json beautifier', 'json validator', 'minify json', 'pretty print'],
    tags: ['json formatter', 'json beautifier', 'json validator', 'minify json', 'pretty print'],
    seoTitle: 'JSON Formatter & Beautifier — Pretty Print & Minify | SmartTools',
    seoDescription: 'Format and beautify JSON online. Syntax error detection, indentation control, and minify options.',
    icon: 'Code2',
    iconName: 'Code2',
    component: JsonFormatter,
    isPopular: true,
    howToUse: ['Paste raw or minified JSON into the editor.', 'Choose indentation style.', 'Click Beautify or Minify.'],
    howItWorks: 'Uses browser JSON.parse and JSON.stringify with custom tab spacing.',
    faqs: [{ question: 'What is the file size limit?', answer: 'Because processing is local, multi-megabyte JSON payloads format smoothly.' }],
    relatedToolSlugs: ['json-validator', 'base64-tool', 'url-encoder-decoder'],
  },

  // 10. Base64 Tool
  {
    id: 'base64-tool',
    slug: 'base64-tool',
    name: 'Base64 Encoder & Decoder',
    category: 'developer',
    categoryId: 'developer',
    shortDescription: 'Encode and decode plain text or binary strings to and from Base64 format with UTF-8 support.',
    fullDescription: 'Convert plain text strings into Base64 format and decode Base64 back into readable text. Full UTF-8 emoji and international character support.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 convert', 'utf-8', 'developer tool'],
    tags: ['base64 encoder', 'base64 decoder', 'base64 convert', 'utf-8', 'developer tool'],
    seoTitle: 'Base64 Encoder & Decoder — UTF-8 & Emoji Compatible | SmartTools',
    seoDescription: 'Encode and decode Base64 strings online with full UTF-8 support. Fast, client-side, and secure.',
    icon: 'Binary',
    iconName: 'Binary',
    component: Base64Tool,
    isPopular: false,
    howToUse: ['Select Encode or Decode mode.', 'Type or paste your text.', 'Copy the converted output.'],
    howItWorks: 'Encodes text using window.btoa and TextEncoder for universal UTF-8 support.',
    faqs: [{ question: 'Does this support emojis and unicode?', answer: 'Yes, full UTF-8 multi-byte encoding is handled properly.' }],
    relatedToolSlugs: ['url-encoder-decoder', 'json-formatter', 'uuid-generator'],
  },

  // 11. Unit Converter
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Universal Unit Converter',
    category: 'travel',
    categoryId: 'travel',
    shortDescription: 'Convert length, weight, temperature, and speed between Metric and Imperial measurements.',
    fullDescription: 'Convert across length, mass, temperature, and speed units. Seamlessly bridge kilometers to miles, kilograms to pounds, and Celsius to Fahrenheit.',
    keywords: ['unit converter', 'metric to imperial', 'length converter', 'temperature converter', 'miles to km'],
    tags: ['unit converter', 'metric to imperial', 'length converter', 'temperature converter', 'miles to km'],
    seoTitle: 'Universal Unit Converter — Length, Weight, Temp & Speed | SmartTools',
    seoDescription: 'Convert units between Metric and Imperial: meters to feet, kg to lbs, Celsius to Fahrenheit, and more.',
    icon: 'ArrowRightLeft',
    iconName: 'ArrowRightLeft',
    component: UnitConverter,
    isPopular: true,
    howToUse: ['Choose category (Length, Weight, Temperature, Speed).', 'Select from and to units.', 'Enter value to see instant conversions.'],
    howItWorks: 'Uses high-precision floating point ratios normalized to base metric reference values.',
    faqs: [{ question: 'How is Celsius converted to Fahrenheit?', answer: 'Formula: (°C × 9/5) + 32 = °F.' }],
    relatedToolSlugs: ['percentage-calculator', 'time-zone-converter', 'ideal-weight-calculator'],
  },

  // 12. Date Difference
  {
    id: 'date-difference-calculator',
    slug: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    category: 'datetime',
    categoryId: 'datetime',
    shortDescription: 'Calculate the exact number of days, weeks, and business days between two calendar dates.',
    fullDescription: 'Measure the exact time duration between any two dates. View the difference in total days, weeks, business working days (excluding weekends), and months.',
    keywords: ['date difference', 'days between dates', 'business days', 'calendar calculator', 'duration'],
    tags: ['date difference', 'days between dates', 'business days', 'calendar calculator', 'duration'],
    seoTitle: 'Date Difference Calculator — Days & Business Days Between Dates | SmartTools',
    seoDescription: 'Calculate days, weeks, and working business days between any two calendar dates.',
    icon: 'CalendarDays',
    iconName: 'CalendarDays',
    component: DateDifference,
    isPopular: false,
    howToUse: ['Select start date and end date.', 'Check business days breakdown.', 'Review weeks, months, and weekend counts.'],
    howItWorks: 'Iterates through the date range accounting for UTC boundaries and Monday-Friday business day filtering.',
    faqs: [{ question: 'Does it calculate business days?', answer: 'Yes, it provides a dedicated count of business weekdays excluding Saturday and Sunday.' }],
    relatedToolSlugs: ['age-calculator', 'countdown-timer', 'unix-timestamp-converter'],
  },

  // 13. UUID Generator
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator',
    category: 'developer',
    categoryId: 'developer',
    shortDescription: 'Generate random RFC 4122 compliant version 4 UUIDs individually or in bulk.',
    fullDescription: 'Generate cryptographically random UUID v4 identifiers complying with RFC 4122. Supports single or bulk generation with uppercase, lowercase, and hyphen options.',
    keywords: ['uuid generator', 'guid generator', 'uuid v4', 'rfc 4122', 'bulk uuid', 'unique id'],
    tags: ['uuid generator', 'guid generator', 'uuid v4', 'rfc 4122', 'bulk uuid', 'unique id'],
    seoTitle: 'UUID Generator — RFC 4122 Version 4 GUIDs in Bulk | SmartTools',
    seoDescription: 'Generate random UUID v4 identifiers compliant with RFC 4122. Fast, bulk generation, with uppercase and hyphen options.',
    icon: 'Hash',
    iconName: 'Hash',
    component: UuidGenerator,
    isPopular: false,
    howToUse: ['Choose quantity of UUIDs (1 to 50).', 'Toggle uppercase or remove hyphens.', 'Copy individually or download batch list.'],
    howItWorks: 'Uses crypto.randomUUID() supported natively in modern browser engines.',
    faqs: [{ question: 'Can I use these for database primary keys?', answer: 'Yes, UUID v4 is standard for distributed databases and API tokens.' }],
    relatedToolSlugs: ['password-generator', 'random-number-generator', 'base64-tool'],
  },

  // 14. Color Converter
  {
    id: 'color-converter',
    slug: 'color-converter',
    name: 'Color Converter & Contrast Checker',
    category: 'image',
    categoryId: 'image',
    shortDescription: 'Convert colors between HEX, RGB, HSL, and CMYK formats with WCAG contrast ratios.',
    fullDescription: 'Pick or enter any color code to convert across HEX, RGB, and HSL values. Test contrast against light and dark backgrounds with real-time WCAG AA and AAA accessibility compliance scores.',
    keywords: ['color converter', 'hex to rgb', 'hsl', 'wcag contrast', 'palette', 'design'],
    tags: ['color converter', 'hex to rgb', 'hsl', 'wcag contrast', 'palette', 'design'],
    seoTitle: 'Color Converter & WCAG Contrast Checker — HEX, RGB, HSL | SmartTools',
    seoDescription: 'Convert HEX, RGB, and HSL color values online. Features live WCAG AA and AAA contrast accessibility scores.',
    icon: 'Palette',
    iconName: 'Palette',
    component: ColorConverter,
    isPopular: false,
    howToUse: ['Enter a color in HEX, RGB, or use the interactive picker.', 'View synchronized formats.', 'Inspect WCAG contrast accessibility scores.'],
    howItWorks: 'Performs matrix conversion between Cartesian sRGB space and cylindrical HSL coordinates.',
    faqs: [{ question: 'What is a passing WCAG AA contrast ratio?', answer: 'WCAG AA requires at least 4.5:1 for regular text and 3:1 for large text.' }],
    relatedToolSlugs: ['image-converter', 'image-compressor', 'image-resizer'],
  },

  // 15. Image Converter
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Converter & Resizer',
    category: 'image',
    categoryId: 'image',
    shortDescription: 'Convert images to WebP, PNG, or JPEG and resize dimensions directly in your browser.',
    fullDescription: 'Convert, compress, and scale images right inside your browser with HTML5 Canvas. Convert PNG or JPEG files to modern high-efficiency WebP format without uploading files to any remote server.',
    keywords: ['image converter', 'webp', 'png', 'jpeg', 'resizer', 'compress', 'privacy'],
    tags: ['image converter', 'webp', 'png', 'jpeg', 'resizer', 'compress', 'privacy'],
    seoTitle: 'Free Image Converter & Resizer — WebP, PNG, JPEG | SmartTools',
    seoDescription: 'Convert and scale images in your browser without uploading to external servers. Fast, secure, and private.',
    icon: 'Image',
    iconName: 'Image',
    component: ImageConverter,
    isPopular: false,
    howToUse: ['Drag and drop an image.', 'Choose target format: WebP, PNG, or JPEG.', 'Click Convert & Download.'],
    howItWorks: 'Transcodes image pixels locally using native HTML5 Canvas API hardware acceleration.',
    faqs: [{ question: 'Are my images uploaded to a cloud server?', answer: 'No, all processing executes 100% locally in your browser memory.' }],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'jpg-to-png'],
  },

  // 16. Discount Calculator
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    category: 'finance',
    categoryId: 'finance',
    shortDescription: 'Calculate sale prices, percentage discounts, coupons, and sales tax savings instantly.',
    fullDescription: 'Find out exactly how much you save on sales and shopping. Supports original price, primary discount percentage, additional store coupons, and sales tax calculation.',
    keywords: ['discount calculator', 'sale price', 'shopping discount', 'percent off', 'coupon savings'],
    tags: ['discount calculator', 'sale price', 'shopping discount', 'percent off', 'coupon savings'],
    seoTitle: 'Discount Calculator — Calculate Sale Price & Money Saved | SmartTools',
    seoDescription: 'Calculate sale prices, percent off discounts, extra coupons, and sales tax savings in real-time.',
    icon: 'Tag',
    iconName: 'Tag',
    component: DiscountCalculator,
    isPopular: true,
    howToUse: [
      'Enter the original retail price.',
      'Select or type the discount percentage (e.g., 20% off).',
      'Optionally add extra store coupon discounts or sales tax.',
      'View your final sale price and total dollars saved.',
    ],
    howItWorks: 'Calculates price reductions sequentially and computes effective compound discounts with sales tax adjustments.',
    faqs: [
      { question: 'How is extra coupon discount calculated?', answer: 'Store coupons are typically applied after the primary markdown, reducing the already discounted price.' },
    ],
    relatedToolSlugs: ['percentage-calculator', 'tip-calculator', 'loan-calculator'],
  },

  // 17. Tip Calculator
  {
    id: 'tip-calculator',
    slug: 'tip-calculator',
    name: 'Tip Calculator & Bill Splitter',
    category: 'finance',
    categoryId: 'finance',
    shortDescription: 'Split restaurant bills, calculate tip amounts, and round up totals per person easily.',
    fullDescription: 'Split restaurant bills easily with friends. Calculate tip amounts, total bill with gratuity, and individual share per person with optional neat dollar round-up.',
    keywords: ['tip calculator', 'bill split', 'gratuity', 'restaurant tip', 'split bill'],
    tags: ['tip calculator', 'bill split', 'gratuity', 'restaurant tip', 'split bill'],
    seoTitle: 'Tip Calculator & Bill Splitter — Calculate Gratuity Per Person | SmartTools',
    seoDescription: 'Calculate tip amounts, total bill, and split per person with round-up options. Fast and simple.',
    icon: 'DollarSign',
    iconName: 'DollarSign',
    component: TipCalculator,
    isPopular: true,
    howToUse: [
      'Enter the total bill amount before tip.',
      'Select your desired tip percentage (10%, 15%, 18%, 20%, etc.).',
      'Specify the number of people splitting the payment.',
      'Optionally check "Round up" for clean dollar totals per person.',
    ],
    howItWorks: 'Multiplies bill by tip percentage and divides the grand total equally across the group count.',
    faqs: [
      { question: 'What is a standard tip percentage in the US?', answer: '15% to 20% is customary for table service in restaurants.' },
    ],
    relatedToolSlugs: ['discount-calculator', 'percentage-calculator', 'simple-interest-calculator'],
  },

  // 18. Simple Interest Calculator
  {
    id: 'simple-interest-calculator',
    slug: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    category: 'finance',
    categoryId: 'finance',
    shortDescription: 'Calculate simple interest, maturity values, and interest yield for loans and deposits.',
    fullDescription: 'Compute simple interest earned or paid on any principal sum over time. Discover total maturity value and annual interest growth using the standard I = P·r·t equation.',
    keywords: ['simple interest', 'interest calculator', 'principal', 'annual rate', 'finance math'],
    tags: ['simple interest', 'interest calculator', 'principal', 'annual rate', 'finance math'],
    seoTitle: 'Simple Interest Calculator — Calculate Interest & Maturity Value | SmartTools',
    seoDescription: 'Calculate simple interest yield, total payout, and maturity value over years or months.',
    icon: 'Landmark',
    iconName: 'Landmark',
    component: SimpleInterestCalculator,
    isPopular: false,
    howToUse: [
      'Enter your initial principal deposit or borrowed amount.',
      'Enter the annual interest rate percentage.',
      'Select time period in years or months.',
      'Review total simple interest earned and final maturity value.',
    ],
    howItWorks: 'Uses the standard simple interest formula: Interest = Principal × Rate × Time.',
    faqs: [
      { question: 'How is simple interest different from compound interest?', answer: 'Simple interest only pays on the initial principal, whereas compound interest also pays on accumulated interest.' },
    ],
    relatedToolSlugs: ['compound-interest-calculator', 'savings-calculator', 'loan-calculator'],
  },

  // 19. Compound Interest Calculator
  {
    id: 'compound-interest-calculator',
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    category: 'finance',
    categoryId: 'finance',
    shortDescription: 'Project future investment growth, monthly deposits, and compound interest returns over time.',
    fullDescription: 'See the power of compound interest in action. Calculate future portfolio value with monthly contributions, variable compounding frequencies, and comprehensive interest breakdowns.',
    keywords: ['compound interest', 'investment growth', 'wealth building', 'apy', 'monthly contribution'],
    tags: ['compound interest', 'investment growth', 'wealth building', 'apy', 'monthly contribution'],
    seoTitle: 'Compound Interest Calculator — Future Investment Growth & APY | SmartTools',
    seoDescription: 'Calculate compound interest growth over time with monthly deposits and various compounding intervals.',
    icon: 'TrendingUp',
    iconName: 'TrendingUp',
    component: CompoundInterestCalculator,
    isPopular: true,
    howToUse: [
      'Enter starting principal and monthly contribution amount.',
      'Specify expected annual interest rate and duration in years.',
      'Select compounding frequency (monthly, daily, quarterly, or annually).',
      'Inspect total ending balance and the proportion created by interest.',
    ],
    howItWorks: 'Uses the future value of an annuity formula compounded at periodic intervals.',
    faqs: [
      { question: 'Why does compounding frequency matter?', answer: 'More frequent compounding (e.g., daily or monthly) generates slightly higher returns than annual compounding.' },
    ],
    relatedToolSlugs: ['savings-calculator', 'simple-interest-calculator', 'loan-calculator'],
  },

  // 20. Savings Calculator
  {
    id: 'savings-calculator',
    slug: 'savings-calculator',
    name: 'Savings Goal Calculator',
    category: 'finance',
    categoryId: 'finance',
    shortDescription: 'Find out how long it takes to reach your savings goal with monthly deposits and interest.',
    fullDescription: 'Plan your financial future with a clear roadmap. Determine the exact months and years needed to achieve your savings goal based on your monthly deposits and APY.',
    keywords: ['savings calculator', 'savings goal', 'financial freedom', 'monthly deposit', 'apy'],
    tags: ['savings calculator', 'savings goal', 'financial freedom', 'monthly deposit', 'apy'],
    seoTitle: 'Savings Goal Calculator — Plan Your Financial Target | SmartTools',
    seoDescription: 'Calculate how long it will take to reach your target savings goal with monthly deposits and interest yield.',
    icon: 'PiggyBank',
    iconName: 'PiggyBank',
    component: SavingsCalculator,
    isPopular: false,
    howToUse: [
      'Enter your target savings target amount.',
      'Enter your starting savings balance.',
      'Specify your monthly deposit and savings account APY.',
      'See the timeline in years and months to reach your goal.',
    ],
    howItWorks: 'Simulates month-by-month compound accumulation until the balance matches or exceeds your target goal.',
    faqs: [
      { question: 'What APY should I enter?', answer: 'Check your high-yield savings account (HYSA) rate, commonly between 3.5% and 5% APY.' },
    ],
    relatedToolSlugs: ['compound-interest-calculator', 'loan-calculator', 'percentage-calculator'],
  },

  // 21. Countdown Timer
  {
    id: 'countdown-timer',
    slug: 'countdown-timer',
    name: 'Online Countdown Timer',
    category: 'datetime',
    categoryId: 'datetime',
    shortDescription: 'Create ticking countdowns to upcoming dates, holidays, events, or deadlines with audio alerts.',
    fullDescription: 'Track time until upcoming product launches, exams, vacations, or holidays. Displays live ticking days, hours, minutes, and seconds with quick presets.',
    keywords: ['countdown timer', 'event countdown', 'deadline timer', 'clock', 'days until'],
    tags: ['countdown timer', 'event countdown', 'deadline timer', 'clock', 'days until'],
    seoTitle: 'Online Countdown Timer — Live Days, Hours & Seconds | SmartTools',
    seoDescription: 'Free online countdown clock. Count down to any future date, event, vacation, or deadline in real-time.',
    icon: 'Timer',
    iconName: 'Timer',
    component: CountdownTimer,
    isPopular: true,
    howToUse: [
      'Give your countdown a custom event name.',
      'Pick the target date and time or choose a quick preset (+1 Hour, +24 Hours, Next New Year).',
      'Watch the live clock tick down with pause and reset controls.',
    ],
    howItWorks: 'Computes continuous millisecond deltas between system clock and target ISO timestamp.',
    faqs: [
      { question: 'Does it work if I switch tabs?', answer: 'Yes, the timer compares absolute timestamps and recalculates accurately when returning to the tab.' },
    ],
    relatedToolSlugs: ['date-difference-calculator', 'time-zone-converter', 'age-calculator'],
  },

  // 22. Time Zone Converter
  {
    id: 'time-zone-converter',
    slug: 'time-zone-converter',
    name: 'World Time Zone Converter',
    category: 'datetime',
    categoryId: 'datetime',
    shortDescription: 'Compare times across major global cities with an interactive hour slider and daylight savings.',
    fullDescription: 'Coordinate international meetings and calls effortlessly. Drag the interactive hour slider to view corresponding local times across UTC, London, New York, Tokyo, Berlin, Sydney, and more.',
    keywords: ['time zone converter', 'world clock', 'utc to est', 'time difference', 'meeting planner'],
    tags: ['time zone converter', 'world clock', 'utc to est', 'time difference', 'meeting planner'],
    seoTitle: 'World Time Zone Converter — Interactive Global Clock | SmartTools',
    seoDescription: 'Compare time across major world cities (UTC, New York, London, Tokyo, Sydney) with an interactive slider.',
    icon: 'Globe',
    iconName: 'Globe',
    component: TimeZoneConverter,
    isPopular: true,
    howToUse: [
      'Drag the interactive UTC hour slider across 24 hours.',
      'Observe real-time synchronized local clocks across major world financial centers.',
      'Click "Sync to Current Live Time" to reset to current clock.',
    ],
    howItWorks: 'Uses browser Intl.DateTimeFormat API with IANA time zone identifiers to handle daylight saving offsets automatically.',
    faqs: [
      { question: 'Does this handle daylight saving time (DST)?', answer: 'Yes, the browser Intl engine accounts for historical and active daylight saving shifts per region.' },
    ],
    relatedToolSlugs: ['countdown-timer', 'date-difference-calculator', 'unix-timestamp-converter'],
  },

  // 23. Ideal Weight Calculator
  {
    id: 'ideal-weight-calculator',
    slug: 'ideal-weight-calculator',
    name: 'Ideal Body Weight Calculator',
    category: 'health',
    categoryId: 'health',
    shortDescription: 'Calculate ideal body weight using Devine, Robinson, Miller, and Hamwi medical formulas.',
    fullDescription: 'Discover your recommended healthy weight based on clinical formulas and World Health Organization BMI guidelines. Compare Devine, Robinson, Miller, and Hamwi equations in metric or imperial.',
    keywords: ['ideal weight', 'healthy weight', 'devine formula', 'robinson formula', 'bmi weight'],
    tags: ['ideal weight', 'healthy weight', 'devine formula', 'robinson formula', 'bmi weight'],
    seoTitle: 'Ideal Weight Calculator — 4 Clinical Formulas & Healthy BMI | SmartTools',
    seoDescription: 'Calculate your ideal body weight using Devine, Robinson, Miller, and Hamwi medical formulas.',
    icon: 'Scale',
    iconName: 'Scale',
    component: IdealWeightCalculator,
    isPopular: false,
    howToUse: [
      'Select Metric (cm) or Imperial (ft/in).',
      'Choose your gender.',
      'Enter your height.',
      'Review consensus average ideal weight and healthy BMI range.',
    ],
    howItWorks: 'Applies standard published clinical equations based on height increments above 5 feet.',
    faqs: [
      { question: 'Which formula is most widely used in medicine?', answer: 'The Devine formula is the most common clinical standard used for medication dosing and nutritional benchmarks.' },
    ],
    relatedToolSlugs: ['bmi-calculator', 'calorie-calculator', 'water-intake-calculator'],
  },

  // 24. Water Intake Calculator
  {
    id: 'water-intake-calculator',
    slug: 'water-intake-calculator',
    name: 'Daily Water Intake Calculator',
    category: 'health',
    categoryId: 'health',
    shortDescription: 'Calculate daily hydration requirements in liters and cups based on weight, climate, and exercise.',
    fullDescription: 'Stay properly hydrated. Calculate your daily recommended water intake in liters, fluid ounces, and 8oz glasses based on body weight, daily workout minutes, climate, and pregnancy status.',
    keywords: ['water intake', 'hydration calculator', 'daily water', 'glasses of water', 'health'],
    tags: ['water intake', 'hydration calculator', 'daily water', 'glasses of water', 'health'],
    seoTitle: 'Daily Water Intake Calculator — Hydration Needs & Tracker | SmartTools',
    seoDescription: 'Calculate your daily water needs based on body weight, workout intensity, and climate with an interactive glass tracker.',
    icon: 'Droplet',
    iconName: 'Droplet',
    component: WaterIntakeCalculator,
    isPopular: false,
    howToUse: [
      'Enter your body weight in kilograms.',
      'Specify daily active exercise minutes.',
      'Select climate condition (moderate vs hot/humid).',
      'Use the interactive glass tracker to check off cups throughout your day.',
    ],
    howItWorks: 'Calculates base hydration at 35ml per kg of body weight, plus adjustments for sweat loss from exercise and temperature.',
    faqs: [
      { question: 'Does coffee or tea count toward hydration?', answer: 'Yes, but pure water remains the best, calorie-free source of daily hydration.' },
    ],
    relatedToolSlugs: ['ideal-weight-calculator', 'bmi-calculator', 'calorie-calculator'],
  },

  // 25. Calorie Calculator
  {
    id: 'calorie-calculator',
    slug: 'calorie-calculator',
    name: 'Calorie & TDEE Calculator',
    category: 'health',
    categoryId: 'health',
    shortDescription: 'Calculate BMR and daily maintenance, weight loss, and muscle building calorie targets.',
    fullDescription: 'Calculate your daily caloric needs using the clinically validated Mifflin-St Jeor equation. See precise targets for weight maintenance, gentle fat loss, fast weight loss, and muscle gain.',
    keywords: ['calorie calculator', 'tdee', 'bmr', 'weight loss calories', 'macro calories', 'metabolism'],
    tags: ['calorie calculator', 'tdee', 'bmr', 'weight loss calories', 'macro calories', 'metabolism'],
    seoTitle: 'Calorie & TDEE Calculator — Mifflin-St Jeor Equation | SmartTools',
    seoDescription: 'Calculate daily maintenance calories, BMR, and targets for weight loss or muscle building.',
    icon: 'Flame',
    iconName: 'Flame',
    component: CalorieCalculator,
    isPopular: true,
    howToUse: [
      'Select gender and enter age, weight, and height.',
      'Choose your weekly physical activity tier.',
      'Review your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).',
    ],
    howItWorks: 'Computes BMR via the Mifflin-St Jeor equation multiplied by standard physical activity factors.',
    faqs: [
      { question: 'What is BMR?', answer: 'Basal Metabolic Rate is the number of calories burned simply staying alive at rest without any physical activity.' },
    ],
    relatedToolSlugs: ['bmi-calculator', 'ideal-weight-calculator', 'water-intake-calculator'],
  },

  // 26. Character Counter
  {
    id: 'character-counter',
    slug: 'character-counter',
    name: 'Character Counter & Social Limits',
    category: 'text',
    categoryId: 'text',
    shortDescription: 'Count characters with/without spaces, words, bytes, and monitor X, SMS, and SEO limits.',
    fullDescription: 'Detailed character and length analyzer. Check character count with spaces, without spaces, total byte size, and live progress bars for Twitter/X (280), SMS (160), and SEO meta descriptions.',
    keywords: ['character counter', 'letter count', 'twitter character count', 'sms length', 'text length'],
    tags: ['character counter', 'letter count', 'twitter character count', 'sms length', 'text length'],
    seoTitle: 'Character Counter — Characters, Letters & Social Limits | SmartTools',
    seoDescription: 'Count characters, spaces, and monitor social limits for X, SMS, and Google meta descriptions in real-time.',
    icon: 'AlignLeft',
    iconName: 'AlignLeft',
    component: CharacterCounter,
    isPopular: false,
    howToUse: [
      'Paste or type your text in the editor.',
      'Observe live character counts with and without spaces.',
      'Review Twitter, SMS, and SEO limit progress bars.',
    ],
    howItWorks: 'Performs instant UTF-16 and byte string length evaluations on client input.',
    faqs: [
      { question: 'What is the standard SMS character limit?', answer: 'Standard single SMS messages contain 160 GSM 7-bit characters.' },
    ],
    relatedToolSlugs: ['word-counter', 'sentence-counter', 'text-cleaner'],
  },

  // 27. Sentence Counter
  {
    id: 'sentence-counter',
    slug: 'sentence-counter',
    name: 'Sentence Counter & Readability Score',
    category: 'text',
    categoryId: 'text',
    shortDescription: 'Count sentences, average words per sentence, and measure Flesch reading ease scores.',
    fullDescription: 'Evaluate the cadence and clarity of your writing. Count sentences, compute average sentence length, and check Flesch-Kincaid reading ease scores from plain English to college grade level.',
    keywords: ['sentence counter', 'readability score', 'flesch reading ease', 'writing grade', 'editor'],
    tags: ['sentence counter', 'readability score', 'flesch reading ease', 'writing grade', 'editor'],
    seoTitle: 'Sentence Counter & Readability Score — Flesch-Kincaid | SmartTools',
    seoDescription: 'Count sentences and assess readability with the Flesch Reading Ease score.',
    icon: 'BookOpen',
    iconName: 'BookOpen',
    component: SentenceCounter,
    isPopular: false,
    howToUse: [
      'Paste your essay, article, or copy into the editor.',
      'View total sentences and average words per sentence.',
      'Check the automated Flesch reading ease grade rating.',
    ],
    howItWorks: 'Tokenizes sentence end markers (.!?) and analyzes syllable-to-word ratios for readability metrics.',
    faqs: [
      { question: 'What is a good Flesch Reading Ease score?', answer: 'A score of 60 to 70 is ideal for the general public (standard plain English).' },
    ],
    relatedToolSlugs: ['word-counter', 'character-counter', 'case-converter'],
  },

  // 28. Remove Duplicate Lines
  {
    id: 'remove-duplicate-lines',
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    category: 'text',
    categoryId: 'text',
    shortDescription: 'Deduplicate text lists, remove duplicate rows, sort alphabetically, and clean lists.',
    fullDescription: 'Clean lists, spreadsheets, keywords, or database IDs. Remove duplicate entries with case sensitivity toggles, whitespace trimming, and optional alphabetical sorting.',
    keywords: ['remove duplicate lines', 'deduplicate list', 'unique lines', 'remove duplicates', 'clean list'],
    tags: ['remove duplicate lines', 'deduplicate list', 'unique lines', 'remove duplicates', 'clean list'],
    seoTitle: 'Remove Duplicate Lines — Free Online Text Deduplicator | SmartTools',
    seoDescription: 'Deduplicate lines of text online. Options for case sensitivity, whitespace trimming, and alphabetical sorting.',
    icon: 'Filter',
    iconName: 'Filter',
    component: RemoveDuplicateLines,
    isPopular: false,
    howToUse: [
      'Paste your multi-line list into the input box.',
      'Configure case sensitivity and whitespace trimming.',
      'Copy the deduplicated clean output.',
    ],
    howItWorks: 'Uses client-side hash set mapping to retain unique entries while preserving original order.',
    faqs: [
      { question: 'Is my data secure?', answer: 'Yes, your text is processed in your browser memory and never leaves your computer.' },
    ],
    relatedToolSlugs: ['text-cleaner', 'case-converter', 'word-counter'],
  },

  // 29. Text Cleaner
  {
    id: 'text-cleaner',
    slug: 'text-cleaner',
    name: 'Text Cleaner & Whitespace Remover',
    category: 'text',
    categoryId: 'text',
    shortDescription: 'Remove extra spaces, blank lines, HTML tags, and emojis from text in one click.',
    fullDescription: 'Sanitize messy copy and scraped content. Strip extra spaces, remove blank empty lines, eliminate HTML/XML tags, and remove emojis instantly.',
    keywords: ['text cleaner', 'remove extra spaces', 'strip html', 'remove empty lines', 'clean copy'],
    tags: ['text cleaner', 'remove extra spaces', 'strip html', 'remove empty lines', 'clean copy'],
    seoTitle: 'Text Cleaner — Remove Extra Spaces, Blank Lines & HTML | SmartTools',
    seoDescription: 'Clean and format messy text online: strip extra spaces, blank lines, HTML tags, and emojis.',
    icon: 'Sparkles',
    iconName: 'Sparkles',
    component: TextCleaner,
    isPopular: false,
    howToUse: [
      'Paste text with messy spacing or tags into the editor.',
      'Select desired cleaning operations (remove spaces, strip HTML, etc.).',
      'Copy the sanitized, clean text.',
    ],
    howItWorks: 'Applies targeted regex sanitization rules sequentially to clean formatting discrepancies.',
    faqs: [
      { question: 'Can it strip HTML tags?', answer: 'Yes, it strips all HTML and XML element tags while preserving the inner text.' },
    ],
    relatedToolSlugs: ['remove-duplicate-lines', 'case-converter', 'word-counter'],
  },

  // 30. JSON Validator
  {
    id: 'json-validator',
    slug: 'json-validator',
    name: 'JSON Validator & Error Checker',
    category: 'developer',
    categoryId: 'developer',
    shortDescription: 'Validate JSON syntax with line and column error reporting, beautification, and minification.',
    fullDescription: 'Troubleshoot and fix invalid JSON. Pinpoint syntax errors with exact line and column numbers, view validation diagnostics, and beautify or minify code.',
    keywords: ['json validator', 'json lint', 'json syntax check', 'validate json', 'developer tool'],
    tags: ['json validator', 'json lint', 'json syntax check', 'validate json', 'developer tool'],
    seoTitle: 'JSON Validator & Syntax Checker — Pinpoint Errors | SmartTools',
    seoDescription: 'Validate JSON code online. Find syntax errors with exact line and column numbers. Beautify and minify JSON.',
    icon: 'Code2',
    iconName: 'Code2',
    component: JsonValidator,
    isPopular: true,
    howToUse: [
      'Paste JSON into the editor.',
      'Review instant validation status and error line numbers.',
      'Use Beautify or Minify to format valid JSON.',
    ],
    howItWorks: 'Parses JSON against RFC 8259 specifications with error message position extraction.',
    faqs: [
      { question: 'Why does JSON require double quotes?', answer: 'The JSON standard strictly requires double quotes for keys and string values; single quotes are invalid.' },
    ],
    relatedToolSlugs: ['json-formatter', 'url-encoder-decoder', 'base64-tool'],
  },

  // 31. URL Encoder / Decoder
  {
    id: 'url-encoder-decoder',
    slug: 'url-encoder-decoder',
    name: 'URL Encoder & Decoder',
    category: 'developer',
    categoryId: 'developer',
    shortDescription: 'Encode and decode URLs, query strings, and parse URL parameters into structured tables.',
    fullDescription: 'Encode special characters for web queries or decode percent-encoded URLs. Includes automatic query parameter extraction into an interactive table.',
    keywords: ['url encoder', 'url decoder', 'urldecode', 'urlencode', 'percent encoding', 'query params'],
    tags: ['url encoder', 'url decoder', 'urldecode', 'urlencode', 'percent encoding', 'query params'],
    seoTitle: 'URL Encoder & Decoder — Percent-Encoding & Query Parser | SmartTools',
    seoDescription: 'Encode and decode URLs and query strings online. Automatically parses query parameters into structured tables.',
    icon: 'Link2',
    iconName: 'Link2',
    component: UrlEncoderDecoder,
    isPopular: false,
    howToUse: [
      'Select Encode or Decode mode.',
      'Enter URL or string.',
      'Inspect parsed query parameters table and copy converted text.',
    ],
    howItWorks: 'Uses browser encodeURIComponent and decodeURIComponent with URL searchParams parsing.',
    faqs: [
      { question: 'What is percent-encoding?', answer: 'Percent-encoding replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits (e.g. space becomes %20).' },
    ],
    relatedToolSlugs: ['base64-tool', 'json-validator', 'json-formatter'],
  },

  // 32. Unix Timestamp Converter
  {
    id: 'unix-timestamp-converter',
    slug: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    category: 'developer',
    categoryId: 'developer',
    shortDescription: 'Convert epoch Unix timestamps to human dates (UTC and local) and dates to timestamps.',
    fullDescription: 'Convert between Unix epoch timestamps (seconds and milliseconds) and human-readable dates. Features live current timestamp clock, ISO 8601 formatting, and relative time indicators.',
    keywords: ['unix timestamp', 'epoch converter', 'timestamp to date', 'epoch to human', 'utc time'],
    tags: ['unix timestamp', 'epoch converter', 'timestamp to date', 'epoch to human', 'utc time'],
    seoTitle: 'Unix Timestamp Converter — Epoch to Human Date & Time | SmartTools',
    seoDescription: 'Convert Unix epoch timestamps to human-readable dates in UTC and local time, and calendar dates to timestamps.',
    icon: 'Clock',
    iconName: 'Clock',
    component: UnixTimestampConverter,
    isPopular: true,
    howToUse: [
      'Enter an epoch timestamp in seconds or milliseconds.',
      'Or pick a date & time to convert into an epoch timestamp.',
      'Inspect UTC, local timezone, and relative time representations.',
    ],
    howItWorks: 'Computes elapsed milliseconds since January 1, 1970 00:00:00 UTC.',
    faqs: [
      { question: 'What is the Year 2038 problem?', answer: '32-bit systems storing timestamps in signed integers will overflow on January 19, 2038; 64-bit systems are unaffected.' },
    ],
    relatedToolSlugs: ['date-difference-calculator', 'time-zone-converter', 'countdown-timer'],
  },

  // 33. Random Number Generator
  {
    id: 'random-number-generator',
    slug: 'random-number-generator',
    name: 'Random Number Generator & Dice Roller',
    category: 'generators',
    categoryId: 'generators',
    shortDescription: 'Generate random numbers within any range, roll dice (d6, d20), and pick winners.',
    fullDescription: 'Generate single numbers or batches of random integers or decimals within any custom range. Features unique/duplicate options, sorting, and tabletop dice roller presets.',
    keywords: ['random number generator', 'rng', 'roll dice', 'random picker', 'dice roller'],
    tags: ['random number generator', 'rng', 'roll dice', 'random picker', 'dice roller'],
    seoTitle: 'Random Number Generator — Free RNG & Tabletop Dice Roller | SmartTools',
    seoDescription: 'Generate random integers or decimals in any range. Includes dice presets (d6, d20) and unique number filters.',
    icon: 'Dices',
    iconName: 'Dices',
    component: RandomNumberGenerator,
    isPopular: false,
    howToUse: [
      'Set your minimum and maximum range.',
      'Choose quantity of numbers to generate.',
      'Toggle duplicates, decimals, or sort order and click Generate.',
    ],
    howItWorks: 'Generates numbers using Math.random() with rejection sampling for uniqueness guarantees.',
    faqs: [
      { question: 'Can I generate unique numbers without duplicates?', answer: 'Yes, check "Allow Duplicates" off to ensure every generated number in the batch is unique.' },
    ],
    relatedToolSlugs: ['password-generator', 'username-generator', 'uuid-generator'],
  },

  // 34. Username Generator
  {
    id: 'username-generator',
    slug: 'username-generator',
    name: 'Username & Handle Generator',
    category: 'generators',
    categoryId: 'generators',
    shortDescription: 'Generate creative handles and usernames for social media, gaming, and tech by style.',
    fullDescription: 'Create creative, memorable usernames and handles for Twitter/X, Instagram, Discord, or gaming. Choose styles like Tech, Aesthetic, Gaming, Minimal, or Creative with custom seed keywords.',
    keywords: ['username generator', 'handle generator', 'gamertag', 'social media username', 'cool handles'],
    tags: ['username generator', 'handle generator', 'gamertag', 'social media username', 'cool handles'],
    seoTitle: 'Username & Handle Generator — Gaming, Tech & Aesthetic | SmartTools',
    seoDescription: 'Generate cool, unique usernames and social handles for gaming, TikTok, Instagram, and Discord.',
    icon: 'Sparkles',
    iconName: 'Sparkles',
    component: UsernameGenerator,
    isPopular: false,
    howToUse: [
      'Select a theme (Tech, Aesthetic, Gaming, Minimal, Creative).',
      'Optionally input a custom seed keyword.',
      'Click any generated handle to instantly copy to clipboard.',
    ],
    howItWorks: 'Pairs curated thematic lexicon banks with optional randomized numeric suffixes.',
    faqs: [
      { question: 'Can I include my real name in the generator?', answer: 'Yes, type your name into the "Custom Keyword" field to generate branded handles.' },
    ],
    relatedToolSlugs: ['password-generator', 'random-number-generator', 'uuid-generator'],
  },

  // 35. Image Compressor
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor (Private & Local)',
    category: 'image',
    categoryId: 'image',
    shortDescription: 'Compress JPEG, PNG, and WebP images directly in your browser with side-by-side quality preview.',
    fullDescription: 'Reduce image file sizes by up to 80% without sacrificing visual quality. Compresses entirely in your browser using HTML5 Canvas with side-by-side comparison.',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'optimize photos', 'webp compression'],
    tags: ['image compressor', 'compress image', 'reduce image size', 'optimize photos', 'webp compression'],
    seoTitle: 'Image Compressor — Compress Photos 100% In-Browser | SmartTools',
    seoDescription: 'Compress images online without uploading to any server. Reduce JPEG, PNG, and WebP file sizes locally.',
    icon: 'Sliders',
    iconName: 'Sliders',
    component: ImageCompressor,
    isPopular: true,
    howToUse: [
      'Upload a JPG, PNG, or WebP image.',
      'Adjust the quality slider to find your desired file size balance.',
      'Click Download Compressed Image.',
    ],
    howItWorks: 'Re-encodes image bitmaps using hardware-accelerated canvas.toBlob() directly in your browser.',
    faqs: [
      { question: 'Is there a file size upload limit?', answer: 'Because all compression runs client-side on your device, standard photos up to 25MB compress smoothly.' },
    ],
    relatedToolSlugs: ['image-resizer', 'image-converter', 'jpg-to-png'],
  },

  // 36. Image Resizer
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer & Dimensions Scaler',
    category: 'image',
    categoryId: 'image',
    shortDescription: 'Resize photos by width and height in pixels or percentage with aspect ratio lock.',
    fullDescription: 'Scale image dimensions accurately by pixel width and height or preset percentages (25%, 50%, 75%, 200%). Features aspect ratio lock and multi-format export.',
    keywords: ['image resizer', 'resize photo', 'scale image', 'change picture dimensions', 'aspect ratio'],
    tags: ['image resizer', 'resize photo', 'scale image', 'change picture dimensions', 'aspect ratio'],
    seoTitle: 'Image Resizer — Change Image Dimensions Online | SmartTools',
    seoDescription: 'Resize image dimensions by pixels or percentage presets with aspect ratio lock. Fast and private.',
    icon: 'Maximize2',
    iconName: 'Maximize2',
    component: ImageResizer,
    isPopular: false,
    howToUse: [
      'Upload an image file.',
      'Enter new width or height in pixels, or click a quick scale preset (50%, 75%, etc.).',
      'Download your resized image.',
    ],
    howItWorks: 'Uses HTML5 Canvas bilinear interpolation to scale pixel dimensions in client memory.',
    faqs: [
      { question: 'Does resizing distort my image?', answer: 'With "Ratio Locked" enabled, changing width automatically updates height proportionally to avoid distortion.' },
    ],
    relatedToolSlugs: ['image-compressor', 'image-cropper', 'image-converter'],
  },

  // 37. JPG to PNG
  {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    category: 'image',
    categoryId: 'image',
    shortDescription: 'Convert JPEG and JPG images to lossless high-fidelity PNG format in your browser.',
    fullDescription: 'Convert any JPG or JPEG image to lossless PNG format instantly. 100% private, client-side conversion without file uploads.',
    keywords: ['jpg to png', 'jpeg to png', 'convert jpg to png', 'lossless png', 'image converter'],
    tags: ['jpg to png', 'jpeg to png', 'convert jpg to png', 'lossless png', 'image converter'],
    seoTitle: 'JPG to PNG Converter — Free & Instant Client-Side Conversion | SmartTools',
    seoDescription: 'Convert JPG/JPEG images to PNG format directly in your browser. Fast, free, and secure.',
    icon: 'Image',
    iconName: 'Image',
    component: JpgToPng,
    isPopular: false,
    howToUse: [
      'Upload or drag-and-drop a JPG/JPEG image.',
      'Watch instant client-side conversion.',
      'Click Download Converted PNG.',
    ],
    howItWorks: 'Renders the JPEG bitmap to an in-memory canvas and extracts as a lossless PNG data URL.',
    faqs: [
      { question: 'Does converting JPG to PNG improve quality?', answer: 'PNG prevents any further compression loss, preserving exact pixel details for further editing.' },
    ],
    relatedToolSlugs: ['png-to-jpg', 'image-compressor', 'image-converter'],
  },

  // 38. PNG to JPG
  {
    id: 'png-to-jpg',
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    category: 'image',
    categoryId: 'image',
    shortDescription: 'Convert PNG images to JPG with custom background fill for transparent areas.',
    fullDescription: 'Convert PNG images to lightweight JPG files. Because JPG does not support transparency, choose a custom background color (white, black, or custom) to fill transparent pixels.',
    keywords: ['png to jpg', 'convert png to jpg', 'transparent to jpg', 'photo converter'],
    tags: ['png to jpg', 'convert png to jpg', 'transparent to jpg', 'photo converter'],
    seoTitle: 'PNG to JPG Converter — Convert PNG to JPEG Online | SmartTools',
    seoDescription: 'Convert PNG images to JPG with customizable background fill for transparent pixels.',
    icon: 'Image',
    iconName: 'Image',
    component: PngToJpg,
    isPopular: false,
    howToUse: [
      'Upload a PNG file.',
      'Pick a background fill color for transparent areas (defaults to white).',
      'Adjust JPG compression quality and download.',
    ],
    howItWorks: 'Pre-fills canvas background with the specified color before rendering PNG transparency layer.',
    faqs: [
      { question: 'Why does my transparent PNG need a background color?', answer: 'The JPEG standard has no alpha transparency channel, so transparent areas must be filled with a solid color.' },
    ],
    relatedToolSlugs: ['jpg-to-png', 'image-compressor', 'image-resizer'],
  },

  // 39. Image Cropper
  {
    id: 'image-cropper',
    slug: 'image-cropper',
    name: 'Image Cropper & Aspect Ratio Tool',
    category: 'image',
    categoryId: 'image',
    shortDescription: 'Crop images with preset aspect ratios (Square 1:1, 16:9, 4:3) or freeform bounds.',
    fullDescription: 'Crop photos and graphics right inside your browser. Select preset aspect ratios like Square 1:1 for profile pictures, 16:9 for YouTube/presentations, or 4:3 with instant download.',
    keywords: ['image cropper', 'crop photo', 'square crop', '16:9 crop', 'avatar cropper'],
    tags: ['image cropper', 'crop photo', 'square crop', '16:9 crop', 'avatar cropper'],
    seoTitle: 'Image Cropper — Crop Photos with 1:1, 16:9 & 4:3 Presets | SmartTools',
    seoDescription: 'Crop images online with preset aspect ratios (Square 1:1, 16:9, 4:3) or custom freeform crop.',
    icon: 'Crop',
    iconName: 'Crop',
    component: ImageCropper,
    isPopular: false,
    howToUse: [
      'Upload an image to crop.',
      'Select an aspect ratio preset (1:1, 16:9, 4:3) or adjust dimensions.',
      'Download your cropped image.',
    ],
    howItWorks: 'Clips source image coordinates using canvas drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight).',
    faqs: [
      { question: 'Can I make a square 1:1 profile picture?', answer: 'Yes, select the "1:1" preset button for an exact square crop.' },
    ],
    relatedToolSlugs: ['image-resizer', 'image-compressor', 'image-converter'],
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return TOOL_REGISTRY.find((tool) => {
    if (tool.slug === normalized || tool.id === normalized) return true;
    if (
      (normalized === 'universal-unit-converter' || normalized === 'unit-converter') &&
      (tool.slug === 'unit-converter' || tool.slug === 'universal-unit-converter')
    ) {
      return true;
    }
    if (
      (normalized === 'base64-tool' ||
        normalized === 'base64-encoder' ||
        normalized === 'base64-decoder' ||
        normalized === 'base64-converter' ||
        normalized === 'base64-encoder-decoder' ||
        normalized === 'base64') &&
      tool.slug === 'base64-tool'
    ) {
      return true;
    }
    return false;
  });
}

export function getToolsByCategory(categoryId: CategoryId): ToolMeta[] {
  return TOOL_REGISTRY.filter((tool) => tool.category === categoryId || tool.categoryId === categoryId);
}
