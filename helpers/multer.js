const slugify = require('slugify');
const path = require('path');
const multer = require('multer');

function randomname(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirPath = path.join(__dirname, '../public/images'); // __dirname ile tam yol al
    console.log('Dosya yolu:', dirPath); // Dosya yolunu logla
    cb(null, dirPath); 
  },
  filename: (req, file, cb) => {
    const randomUniqueName = randomname(10);
    const fileName = path.basename(file.originalname, path.extname(file.originalname));
    const fileExt = path.extname(file.originalname);
    const cleanedFileName = slugify(fileName, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
    });
    const limitedFileName = cleanedFileName.substring(0, 50);
    const finalFileName = `${randomUniqueName}${limitedFileName}${fileExt}`;
    
    req.imageFileName = finalFileName;

    cb(null, finalFileName);
    console.log(finalFileName);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB'a kadar olan dosyaları kabul et
  },
});

module.exports = {
  upload
};