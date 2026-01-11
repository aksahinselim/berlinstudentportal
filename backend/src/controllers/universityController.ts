import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getUniversities = async (req: Request, res: Response) => {
  try {
    const universities = await prisma.university.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: universities
    });
  } catch (err: any) {
    console.error('Get universities error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getUniversityById = async (req: Request, res: Response) => {
  try {
    const university = await prisma.university.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!university) {
      return res.status(404).json({ success: false, error: 'University not found' });
    }

    res.json({
      success: true,
      data: university
    });
  } catch (err: any) {
    console.error('Get university by ID error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
