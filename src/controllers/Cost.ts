import { NextFunction, Request, Response } from 'express';
import { number } from 'joi';
import mongoose from 'mongoose';
import Cost from '../models/Cost';

const createCost = (req: Request, res: Response, next: NextFunction) => {
    const { name, added, brutto, netto } = req.body;

    const cost = new Cost({
        _id: new mongoose.Types.ObjectId(),
        name,
        added,
        brutto,
        netto
    });

    return cost
        .save()
        .then((cost) => res.status(201).json({ cost }))
        .catch((error) => res.status(500).json({ error }));
};

const readCost = (req: Request, res: Response, next: NextFunction) => {
    const costMonth = req.params.costMonth;

    return Cost.find({ $expr: { $eq: [{ $month: '$added' }, costMonth] } })
        .sort({ brutto: -1 })
        .then((cost) => (cost ? res.status(200).json({ cost }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readCostDetail = (req: Request, res: Response, next: NextFunction) => {
    let costYear = req.params.costYear;
    let costMonth = req.params.costMonth;

    let islastDay = function (costYear: any, costMonth: any) {
        return new Date(costYear, costMonth, 0).getDate();
    };

    const lastDay = islastDay(costYear, costMonth);

    return Cost.aggregate([
        {
            $match: {
                $and: [
                    {
                        $expr: {
                            $gte: ['$added', { $dateFromString: { dateString: costYear + '-' + costMonth + '-' + '01' } }]
                        }
                    },
                    {
                        $expr: {
                            $lt: ['$added', { $dateFromString: { dateString: costYear + '-' + costMonth + '-' + lastDay } }]
                        }
                    }
                ]
            }
        },
        {
            $group: {
                _id: { year: { $year: '$added' }, month: { $month: '$added' } },
                bruttoSum: { $sum: '$brutto' },
                nettoSum: { $sum: '$netto' },
                bruttoAvg: { $avg: '$brutto' },
                costsAmount: {
                    $sum: 1
                }
            }
        }
    ])
        .then((cost) => (cost ? res.status(200).json({ cost }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Cost.find()
        .then((costs) => res.status(200).json({ costs }))
        .catch((error) => res.status(500).json({ error }));
};

const updateCost = (req: Request, res: Response, next: NextFunction) => {
    const costId = req.params.costId;

    return Cost.findById(costId)
        .then((cost) => {
            if (cost) {
                cost.set(req.body);

                return cost
                    .save()
                    .then((cost) => res.status(201).json({ cost }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteCost = (req: Request, res: Response, next: NextFunction) => {
    const costId = req.params.costId;

    return Cost.findByIdAndDelete(costId)
        .then((cost) => (cost ? res.status(201).json({ message: 'deleted' }) : res.status(404).json({ message: 'Not found ' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createCost, readCost, readCostDetail, readAll, updateCost, deleteCost };
