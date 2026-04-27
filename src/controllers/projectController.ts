import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Project from '../models/Project';
import Application from '../models/Application';
import Listing from '../models/Listing';
import User from '../models/User';

export const hireArtisan = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = req.userId;
    const { applicationId, agreementBudget, startDate, dueDate } = req.body;

    const application = await Application.findById(applicationId).populate('listing');
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    const listing = await Listing.findById(application.listing);
    if (!listing || listing.customer.toString() !== customerId) {
      res.status(403).json({ message: 'You are not authorized to hire for this listing' });
      return;
    }

    if (application.status !== 'pending' && application.status !== 'accepted') {
      res.status(400).json({ message: 'You can only hire from pending or accepted applications' });
      return;
    }

    if (!agreementBudget || !startDate || !dueDate) {
      res.status(400).json({ message: 'Agreement budget, start date, and due date are required' });
      return;
    }

    const start = new Date(startDate);
    const due = new Date(dueDate);

    if (due <= start) {
      res.status(400).json({ message: 'Due date must be after start date' });
      return;
    }

    // Check if a project already exists for this application
    const existingProject = await Project.findOne({ application: applicationId });
    if (existingProject) {
      res.status(400).json({ message: 'A project has already been created for this application' });
      return;
    }

    const project = new Project({
      listing: listing._id,
      customer: customerId,
      artisan: application.artisan,
      application: applicationId,
      agreementBudget,
      status: 'active',
      progress: 0,
      startDate: start,
      dueDate: due,
      milestones: [],
      updates: [],
    });

    await project.save();

    // Update application status to accepted
    application.status = 'accepted';
    await application.save();

    // Update listing status to in-progress
    listing.status = 'in-progress';
    await listing.save();

    res.status(201).json({ message: 'Artisan hired successfully', project });
  } catch (error: any) {
    console.error('Hire artisan error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({
      $or: [{ customer: req.userId }, { artisan: req.userId }],
    })
      .populate('listing')
      .populate('customer', 'username email profile')
      .populate('artisan', 'username email profile')
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error: any) {
    console.error('Get my projects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('listing')
      .populate('customer', 'username email profile')
      .populate('artisan', 'username email profile')
      .populate('updates.artisan', 'username');

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check authorization
    if (
      project.customer._id.toString() !== req.userId &&
      project.artisan._id.toString() !== req.userId
    ) {
      res.status(403).json({ message: 'You are not authorized to view this project' });
      return;
    }

    res.status(200).json(project);
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProjectProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { progress } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (project.artisan.toString() !== req.userId) {
      res.status(403).json({ message: 'Only the assigned artisan can update progress' });
      return;
    }

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      res.status(400).json({ message: 'Progress must be a number between 0 and 100' });
      return;
    }

    project.progress = progress;
    if (progress === 100 && !project.completionDate) {
      project.completionDate = new Date();
      project.status = 'completed';
    }

    await project.save();
    res.status(200).json({ message: 'Project progress updated', project });
  } catch (error: any) {
    console.error('Update project progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProjectStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (project.customer.toString() !== req.userId && project.artisan.toString() !== req.userId) {
      res.status(403).json({ message: 'You are not authorized to update this project' });
      return;
    }

    if (!['active', 'in-progress', 'completed', 'cancelled', 'disputed'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    project.status = status;
    if (status === 'completed' && !project.completionDate) {
      project.completionDate = new Date();
    }

    await project.save();
    res.status(200).json({ message: 'Project status updated', project });
  } catch (error: any) {
    console.error('Update project status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addProjectUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, attachments } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (project.artisan.toString() !== req.userId) {
      res.status(403).json({ message: 'Only the assigned artisan can add updates' });
      return;
    }

    if (!message) {
      res.status(400).json({ message: 'Update message is required' });
      return;
    }

    const update = {
      artisan: new Types.ObjectId(req.userId),
      message,
      attachments: Array.isArray(attachments) ? attachments : [],
      createdAt: new Date(),
    };

    project.updates.push(update);
    await project.save();

    res.status(201).json({ message: 'Project update added successfully', update });
  } catch (error: any) {
    console.error('Add project update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addMilestone = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (project.customer.toString() !== req.userId) {
      res.status(403).json({ message: 'Only the customer can add milestones' });
      return;
    }

    if (!title || !dueDate) {
      res.status(400).json({ message: 'Title and due date are required' });
      return;
    }

    const milestone = {
      title,
      description: description || '',
      dueDate: new Date(dueDate),
      status: 'pending' as const,
    };

    if (!project.milestones) {
      project.milestones = [];
    }

    project.milestones.push(milestone);
    await project.save();

    res.status(201).json({ message: 'Milestone added successfully', milestone });
  } catch (error: any) {
    console.error('Add milestone error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const completeMilestone = async (req: Request, res: Response): Promise<void> => {
  try {
    const { milestoneIndex } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (project.artisan.toString() !== req.userId) {
      res.status(403).json({ message: 'Only the assigned artisan can complete milestones' });
      return;
    }

    if (typeof milestoneIndex !== 'number' || !project.milestones || !project.milestones[milestoneIndex]) {
      res.status(400).json({ message: 'Invalid milestone index' });
      return;
    }

    project.milestones[milestoneIndex].status = 'completed';
    project.milestones[milestoneIndex].completedDate = new Date();

    await project.save();

    res.status(200).json({
      message: 'Milestone marked as completed',
      milestone: project.milestones[milestoneIndex],
    });
  } catch (error: any) {
    console.error('Complete milestone error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
