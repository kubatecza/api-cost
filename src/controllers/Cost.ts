import { NextFunction, Request, Response } from 'express';
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

// const readCost1 = (req: Request, res: Response, next: NextFunction) => {
//     const costMonth = req.params.costMonth;
//     const costYear = req.params.costYear;

//     Cost.find({
//         $and: [{ $expr: { $eq: [{ $month: '$added' }, costMonth] } }, { $expr: { $eq: [{ $year: '$added' }, costYear] } }]
//     }).count();

//     const month = costMonth;
//     const year = costYear;
//     const bruttoSum = ;
//     const nettoSum = ;
//     const bruttoAverage = ;
//     const costsAmount = Cost.find({
//         $and: [{ $expr: { $eq: [{ $month: '$added' }, costMonth] } }, { $expr: { $eq: [{ $year: '$added' }, costYear] } }]
//     }).count();

//     const monthCost = new MonthCost({
//         _id: new mongoose.Types.ObjectId(),
//         month,
//         year,
//         bruttoSum,
//         nettoSum,
//         bruttoAverage,
//         costsAmount
//     });

//     return Cost.find({
//         $and: [{ $expr: { $eq: [{ $month: '$added' }, costMonth] } }, { $expr: { $eq: [{ $year: '$added' }, costYear] } }]
//     })
//         .sort({ brutto: -1 })
//         .then((cost) => (cost ? res.status(200).json({ cost }) : res.status(404).json({ message: 'Not found' })))
//         .catch((error) => res.status(500).json({ error }));
// };

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

export default { createCost, readCost, readAll, updateCost, deleteCost };
