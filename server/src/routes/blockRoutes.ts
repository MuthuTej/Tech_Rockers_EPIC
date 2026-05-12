import { Router } from 'express';
import {
  getBlocks,
  getBlockById,
  createBlock,
  updateBlock,
  deleteBlock,
} from '../controllers/blockController';

const router = Router();

router.route('/').get(getBlocks).post(createBlock);
router.route('/:id').get(getBlockById).put(updateBlock).delete(deleteBlock);

export default router;
