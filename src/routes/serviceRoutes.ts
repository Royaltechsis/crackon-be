import { Router } from 'express';
import { authenticate, isArtisan } from '../middleware/auth';
import {
  createService,
  getServices,
  getServiceById,
  getMyServices,
  updateService,
  deleteService,
  getServicesByArtisan,
} from '../controllers/serviceController';

const router = Router();

/**
 * @openapi
 * /api/services:
 *   post:
 *     tags:
 *       - Services
 *     summary: Create a new service offering
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       '201':
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticate, isArtisan, createService);

/**
 * @openapi
 * /api/services:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get all published services
 *     responses:
 *       '200':
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/', getServices);

/**
 * @openapi
 * /api/services/mine:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get services created by the authenticated artisan
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of artisan services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/mine', authenticate, isArtisan, getMyServices);

/**
 * @openapi
 * /api/services/artisan/{artisanId}:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get published services for a specific artisan
 *     parameters:
 *       - in: path
 *         name: artisanId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Service list returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/artisan/:artisanId', getServicesByArtisan);

/**
 * @openapi
 * /api/services/{id}:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get a single service by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Service returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       '404':
 *         description: Service not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getServiceById);

/**
 * @openapi
 * /api/services/{id}:
 *   put:
 *     tags:
 *       - Services
 *     summary: Update a service by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceRequest'
 *     responses:
 *       '200':
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Service not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', authenticate, isArtisan, updateService);

/**
 * @openapi
 * /api/services/{id}:
 *   delete:
 *     tags:
 *       - Services
 *     summary: Delete a service by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Service not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticate, isArtisan, deleteService);

export default router;
