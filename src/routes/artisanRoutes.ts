import { Router } from 'express';
import { authenticate, isArtisan } from '../middleware/auth';
import { updateArtisanProfile, getArtisanById } from '../controllers/artisanController';

const router = Router();

/**
 * @openapi
 * /api/artisans/profile:
 *   put:
 *     tags:
 *       - Artisans
 *     summary: Update authenticated artisan profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtisanProfileUpdateRequest'
 *     responses:
 *       '200':
 *         description: Artisan profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/profile', authenticate, isArtisan, updateArtisanProfile);

/**
 * @openapi
 * /api/artisans/{id}:
 *   get:
 *     tags:
 *       - Artisans
 *     summary: Get public artisan profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Artisan profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '404':
 *         description: Artisan not found
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getArtisanById);

export default router;
