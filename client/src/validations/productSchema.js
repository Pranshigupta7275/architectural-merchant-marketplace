// src/validations/productSchema.js
import * as yup from 'yup';

export const productValidationSchema = yup.object().shape({
  // STEP 1
  title: yup.string().required('Product title is required'),
  price: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required'),
  status: yup.string().oneOf(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  
  // STEP 2
  technicalSpecs: yup.object().shape({
    primaryMaterial: yup.string().required('Primary material is required'),
    finish: yup.string().required('Finish is required'),
    weightCapacity: yup.number().typeError('Must be a number').positive(),
  }),

  // STEP 3
  inventory: yup.object().shape({
    sku: yup.string().required('SKU is required'),
    stockQuantity: yup.number().typeError('Must be a number').min(0, 'Cannot be negative').required('Stock is required'),
  }),
  shipping: yup.object().shape({
    shippingClass: yup.string().oneOf(['Standard', 'Fragile', 'Heavy/Bulky', 'Express Only']).required('Shipping class is required'),
  }),
});