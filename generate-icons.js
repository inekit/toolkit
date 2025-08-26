const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Размеры иконок для PWA
const iconSizes = [16, 32, 192, 512];

// Создаем папку для иконок если её нет
const iconsDir = path.join(__dirname, 'public');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  console.log('🎨 Генерация PNG иконок из SVG...');

  try {
    // Читаем SVG файл
    const svgPath = path.join(__dirname, 'public', 'favicon.svg');
    if (!fs.existsSync(svgPath)) {
      throw new Error('SVG файл не найден: ' + svgPath);
    }

    const svgBuffer = fs.readFileSync(svgPath);

    // Генерируем иконки для каждого размера
    for (const size of iconSizes) {
      const iconName = `icon-${size}x${size}.png`;
      const iconPath = path.join(iconsDir, iconName);

      console.log(`📱 Создаем ${iconName} (${size}x${size})...`);

      await sharp(svgBuffer).resize(size, size).png().toFile(iconPath);

      // Проверяем размер файла
      const stats = fs.statSync(iconPath);
      console.log(
        `✅ ${iconName} создан (${(stats.size / 1024).toFixed(2)} KB)`
      );
    }

    // Создаем favicon.ico (16x16)
    console.log('🔧 Создаем favicon-16x16.png...');
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(path.join(iconsDir, 'favicon-16x16.png'));

    console.log('✅ favicon-16x16.png создан');

    // Создаем apple-touch-icon (180x180) - стандартный размер для iOS
    console.log('🍎 Создаем apple-touch-icon.png (180x180)...');
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(iconsDir, 'apple-touch-icon.png'));

    console.log('✅ apple-touch-icon.png создан (180x180)');

    // Создаем дополнительную иконку для iOS (152x152)
    console.log('📱 Создаем icon-152x152.png для iOS...');
    await sharp(svgBuffer)
      .resize(152, 152)
      .png()
      .toFile(path.join(iconsDir, 'icon-152x152.png'));

    console.log('✅ icon-152x152.png создан');

    console.log('\n🎉 Все иконки успешно созданы!');
    console.log('📁 Файлы сохранены в:', iconsDir);

    // Показываем список созданных файлов
    const files = fs
      .readdirSync(iconsDir)
      .filter((file) => file.endsWith('.png'));
    console.log('\n📋 Созданные файлы:');
    files.forEach((file) => {
      const stats = fs.statSync(path.join(iconsDir, file));
      console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });

    console.log('\n💡 Рекомендации по использованию:');
    console.log('  - icon-16x16.png и icon-32x32.png - для фавиконов');
    console.log('  - icon-192x192.png - для Android PWA');
    console.log('  - icon-512x512.png - для Android PWA (высокое разрешение)');
    console.log('  - apple-touch-icon.png (180x180) - для iOS устройств');
    console.log('  - icon-152x152.png - дополнительно для iOS');
  } catch (error) {
    console.error('❌ Ошибка при генерации иконок:', error.message);
    process.exit(1);
  }
}

// Запускаем генерацию
generateIcons();
