import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  hireArtisan,
  getMyProjects,
  getProjectById,
  updateProjectProgress,
  updateProjectStatus,
  addProjectUpdate,
  addMilestone,
  completeMilestone,
} from '../controllers/projectController';

const router = Router();

/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Hire an artisan for a listing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationId:
 *                 type: string
 *               agreementBudget:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       '201':
 *         description: Artisan hired successfully
 *       '403':
 *         description: Only customers can hire artisans
 */
/**
 * @openapi
 * /api/projects/mine:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all projects (as customer or artisan)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of projects
 */
router.get('/mine', authenticate, getMyProjects);

router.post('/', authenticate, authorize('customer'), hireArtisan);

/**
 * @openapi
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get project details and tracking information
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
 *         description: Project details with tracking information
 */
router.get('/:id', authenticate, getProjectById);

/**
 * @openapi
 * /api/projects/{id}/progress:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update project progress (artisan only)
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
 *               progress:
 *                 type: number
 *                 description: Progress percentage (0-100)
 *     responses:
 *       '200':
 *         description: Progress updated
 */
router.put('/:id/progress', authenticate, authorize('artisan'), updateProjectProgress);

/**
 * @openapi
 * /api/projects/{id}/status:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update project status
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
 *                 enum: [active, in-progress, completed, cancelled, disputed]
 *     responses:
 *       '200':
 *         description: Project status updated
 */
router.put('/:id/status', authenticate, updateProjectStatus);

/**
 * @openapi
 * /api/projects/{id}/update:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Add a project update (artisan only)
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
 *               message:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '201':
 *         description: Update added successfully
 */
router.post('/:id/update', authenticate, authorize('artisan'), addProjectUpdate);

/**
 * @openapi
 * /api/projects/{id}/milestones:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Add a milestone to a project (customer only)
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       '201':
 *         description: Milestone added successfully
 */
router.post('/:id/milestones', authenticate, authorize('customer'), addMilestone);

/**
 * @openapi
 * /api/projects/{id}/milestones/complete:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Mark a milestone as completed (artisan only)
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
 *               milestoneIndex:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Milestone marked as completed
 */
router.put('/:id/milestones/complete', authenticate, authorize('artisan'), completeMilestone);

export default router;
