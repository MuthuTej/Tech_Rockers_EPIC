import { Request, Response } from 'express';
import { Block } from '../models/Block';

export const getBlocks = async (req: Request, res: Response) => {
  try {
    const blocks = await Block.find().sort({ createdAt: -1 });
    res.json(blocks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlockById = async (req: Request, res: Response) => {
  try {
    const block = await Block.findOne({ id: req.params.id });
    if (!block) return res.status(404).json({ message: 'Block not found' });
    res.json(block);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlock = async (req: Request, res: Response) => {
  try {
    const block = new Block(req.body);
    const savedBlock = await block.save();
    res.status(201).json(savedBlock);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBlock = async (req: Request, res: Response) => {
  try {
    const updatedBlock = await Block.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBlock) return res.status(404).json({ message: 'Block not found' });
    res.json(updatedBlock);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBlock = async (req: Request, res: Response) => {
  try {
    const deletedBlock = await Block.findOneAndDelete({ id: req.params.id });
    if (!deletedBlock) return res.status(404).json({ message: 'Block not found' });
    res.json({ message: 'Block deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
