import { Request, Response } from 'express';
import Service from '../models/Service';
import User from '../models/User';

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const artisanId = req.userId;
    const { title, description, category, price, duration, location, tags, isPublished } = req.body;

    const artisan = await User.findById(artisanId);
    if (!artisan || artisan.role !== 'artisan') {
      res.status(403).json({ message: 'Only artisans can post services' });
      return;
    }

    if (!title || !description) {
      res.status(400).json({ message: 'Service title and description are required' });
      return;
    }

    const service = new Service({
      title,
      description,
      category,
      price,
      duration,
      location,
      tags: Array.isArray(tags) ? tags : [],
      isPublished: typeof isPublished === 'boolean' ? isPublished : true,
      artisan: artisan._id,
    });

    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error: any) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ isPublished: true }).populate('artisan', 'username profile location');
    res.status(200).json(services);
  } catch (error: any) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id).populate('artisan', 'username profile location');
    if (!service || !service.isPublished) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    res.status(200).json(service);
  } catch (error: any) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ artisan: req.userId }).populate('artisan', 'username profile location');
    res.status(200).json(services);
  } catch (error: any) {
    console.error('Get artisan services error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getServicesByArtisan = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ artisan: req.params.artisanId, isPublished: true }).populate('artisan', 'username profile location');
    res.status(200).json(services);
  } catch (error: any) {
    console.error('Get services by artisan error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    if (service.artisan.toString() !== req.userId) {
      res.status(403).json({ message: 'You can only update your own services' });
      return;
    }

    const { title, description, category, price, duration, location, tags, isPublished } = req.body;
    if (title) service.title = title;
    if (description) service.description = description;
    if (category !== undefined) service.category = category;
    if (price !== undefined) service.price = price;
    if (duration !== undefined) service.duration = duration;
    if (location !== undefined) service.location = location;
    if (Array.isArray(tags)) service.tags = tags;
    if (typeof isPublished === 'boolean') service.isPublished = isPublished;

    await service.save();
    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error: any) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    if (service.artisan.toString() !== req.userId) {
      res.status(403).json({ message: 'You can only delete your own services' });
      return;
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
