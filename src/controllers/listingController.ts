import { Request, Response } from 'express';
import Listing from '../models/Listing';
import User from '../models/User';

export const createListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = req.userId;
    const { title, description, category, budget, duration, location, skills } = req.body;

    const customer = await User.findById(customerId);
    if (!customer || customer.role !== 'customer') {
      res.status(403).json({ message: 'Only customers can post listings' });
      return;
    }

    if (!title || !description || !category || !budget || !location || !skills) {
      res.status(400).json({ message: 'All required fields must be provided' });
      return;
    }

    if (budget.min > budget.max) {
      res.status(400).json({ message: 'Minimum budget cannot be greater than maximum budget' });
      return;
    }

    const listing = new Listing({
      title,
      description,
      category,
      budget,
      duration,
      location,
      skills: Array.isArray(skills) ? skills : [],
      customer: customerId,
    });

    await listing.save();
    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (error: any) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, location, status } = req.query;
    const filter: any = { status: status || 'open' };

    if (category) filter.category = category;
    if (location) filter.location = location;

    const listings = await Listing.find(filter)
      .populate('customer', 'username email profile')
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error: any) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id).populate('customer', 'username email profile');

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    res.status(200).json(listing);
  } catch (error: any) {
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const listings = await Listing.find({ customer: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error: any) {
    console.error('Get my listings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.customer.toString() !== req.userId) {
      res.status(403).json({ message: 'You are not authorized to update this listing' });
      return;
    }

    const { title, description, category, budget, duration, location, skills, status } = req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (category) listing.category = category;
    if (budget) {
      if (budget.min > budget.max) {
        res.status(400).json({ message: 'Minimum budget cannot be greater than maximum budget' });
        return;
      }
      listing.budget = budget;
    }
    if (duration) listing.duration = duration;
    if (location) listing.location = location;
    if (skills) listing.skills = skills;
    if (status) listing.status = status;

    await listing.save();
    res.status(200).json({ message: 'Listing updated successfully', listing });
  } catch (error: any) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }

    if (listing.customer.toString() !== req.userId) {
      res.status(403).json({ message: 'You are not authorized to delete this listing' });
      return;
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
