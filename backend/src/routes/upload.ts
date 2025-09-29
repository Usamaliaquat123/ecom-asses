import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authenticateToken } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = express.Router()

// Apply authentication
router.use(authenticateToken)

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow images and documents
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|csv/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// POST /api/upload - Upload single file
router.post('/', upload.single('file'), asyncHandler(async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    })
  }

  const fileUrl = `/uploads/${req.file.filename}`

  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl,
      path: req.file.path
    }
  })
}))

// POST /api/upload/multiple - Upload multiple files
router.post('/multiple', upload.array('files', 10), asyncHandler(async (req: any, res: any) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded'
    })
  }

  const files = req.files.map((file: any) => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    url: `/uploads/${file.filename}`,
    path: file.path
  }))

  res.json({
    success: true,
    message: `${files.length} files uploaded successfully`,
    data: { files }
  })
}))

// DELETE /api/upload/:filename - Delete uploaded file
router.delete('/:filename', asyncHandler(async (req: any, res: any) => {
  const { filename } = req.params
  const filePath = path.join('uploads', filename)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found'
    })
  }

  fs.unlinkSync(filePath)

  res.json({
    success: true,
    message: 'File deleted successfully'
  })
}))

export default router
