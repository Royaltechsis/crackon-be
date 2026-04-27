import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
} from '../controllers/listingController';

const router = Router();

/**
 * @openapi
 * /api/listings:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Create a new job listing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               budget:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *               duration:
 *                 type: string
 *               location:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '201':
 *         description: Listing created successfully
 *       '403':
 *         description: Only customers can post listings
 */
router.post('/', authenticate, authorize('customer'), createListing);

/**
 * @openapi
 * /api/listings:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Get all open job listings
 *     parameters:
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *       - name: location
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of listings
 */
router.get('/', getListings);

/**
 * @openapi
 * /api/listings/mine:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Get listings posted by the authenticated customer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of customer listings
 */
router.get('/mine', authenticate, authorize('customer'), getMyListings);

/**
 * @openapi
 * /api/listings/{id}:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Get a specific listing
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Listing details
 */
router.get('/:id', getListingById);

/**
 * @openapi
 * /api/listings/{id}:
 *   put:
 *     tags:
 *       - Listings
 *     summary: Update a listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Listing updated successfully
 */
router.put('/:id', authenticate, authorize('customer'), updateListing);

/**
 * @openapi
 * /api/listings/{id}:
 *   delete:
 *     tags:
 *       - Listings
 *     summary: Delete a listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Listing deleted successfully
 */
router.delete('/:id', authenticate, authorize('customer'), deleteListing);

export default router;
