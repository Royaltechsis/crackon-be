import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  applyForListing,
  getListingApplications,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/applicationController';

const router = Router();

/**
 * @openapi
 * /api/applications:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Apply for a listing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listingId:
 *                 type: string
 *               proposedBudget:
 *                 type: number
 *               coverLetter:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Application submitted successfully
 *       '403':
 *         description: Only artisans can apply for listings
 */
router.post('/', authenticate, authorize('artisan'), applyForListing);

/**
 * @openapi
 * /api/applications/mine:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Get my applications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of artisan applications
 */
router.get('/mine', authenticate, authorize('artisan'), getMyApplications);

/**
 * @openapi
 * /api/applications/{id}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Get a specific application
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
 *         description: Application details
 */
router.get('/:id', authenticate, getApplicationById);

/**
 * @openapi
 * /api/applications/listing/{listingId}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Get applications for a listing (customer only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: listingId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of applications
 */
router.get('/listing/:listingId', authenticate, authorize('customer'), getListingApplications);

/**
 * @openapi
 * /api/applications/{id}/status:
 *   put:
 *     tags:
 *       - Applications
 *     summary: Update application status (accept/reject)
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected, withdrawn]
 *     responses:
 *       '200':
 *         description: Application status updated
 */
router.put('/:id/status', authenticate, authorize('customer'), updateApplicationStatus);

/**
 * @openapi
 * /api/applications/{id}/withdraw:
 *   put:
 *     tags:
 *       - Applications
 *     summary: Withdraw an application
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
 *         description: Application withdrawn
 */
router.put('/:id/withdraw', authenticate, authorize('artisan'), withdrawApplication);

export default router;
