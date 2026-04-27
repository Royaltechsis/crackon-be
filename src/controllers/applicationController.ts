import { Request, Response } from 'express';
import Application from '../models/Application';
import Listing from '../models/Listing';
import User from '../models/User';

export const applyForListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const artisanId = req.userId;
    const { listingId, proposedBudget, coverLetter } = req.body;

    const artisan = await User.findById(artisanId);
    if (!artisan || artisan.role !== 'artisan') {
      res.status(403).json({ message: 'Only artisans can apply for listings' });
      return;
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.status !== 'open') {
      res.status(400).json({ message: 'This listing is no longer open' });
      return;
    }

    if (!proposedBudget || !coverLetter) {
      res.status(400).json({ message: 'Proposed budget and cover letter are required' });
      return;
    }

    // Check if artisan already applied for this listing
    const existingApplication = await Application.findOne({
      listing: listingId,
      artisan: artisanId,
    });

    if (existingApplication) {
      res.status(400).json({ message: 'You have already applied for this listing' });
      return;
    }

    const application = new Application({
      listing: listingId,
      artisan: artisanId,
      proposedBudget,
      coverLetter,
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error: any) {
    console.error('Apply for listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getListingApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.listingId);

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.customer.toString() !== req.userId) {
      res.status(403).json({ message: 'You are not authorized to view applications for this listing' });
      return;
    }

    const applications = await Application.find({ listing: req.params.listingId })
      .populate('artisan', 'username email profile')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error: any) {
    console.error('Get listing applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ artisan: req.userId })
      .populate('listing', 'title description category budget location')
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error: any) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('listing')
      .populate('artisan', 'username email profile');

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.status(200).json(application);
  } catch (error: any) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('listing');

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    const listing = await Listing.findById(application.listing);
    if (listing?.customer.toString() !== req.userId) {
      res.status(403).json({ message: 'You are not authorized to update this application' });
      return;
    }

    if (!['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Application status updated successfully', application });
  } catch (error: any) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const withdrawApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    if (application.artisan.toString() !== req.userId) {
      res.status(403).json({ message: 'You are not authorized to withdraw this application' });
      return;
    }

    if (application.status !== 'pending') {
      res.status(400).json({ message: 'You can only withdraw pending applications' });
      return;
    }

    application.status = 'withdrawn';
    await application.save();

    res.status(200).json({ message: 'Application withdrawn successfully', application });
  } catch (error: any) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
