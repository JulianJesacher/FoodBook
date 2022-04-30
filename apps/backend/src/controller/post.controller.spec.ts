import { isValidOperator, isValidField } from './post.controller';
import { createExampleDish } from '../entity/Dish.entity';
describe('isValidOperator', () => {
    it('does not test the array index', () => {
        expect(isValidOperator('0')).toBe(false);
    });

    it('accepts = as operator', () => {
        expect(isValidOperator('=')).toBe(true);
    });
});

describe('isValidField', () => {
    it('doesnt accept username as field', () => {
        expect(isValidField('username')).toBe(false);
    });

    it('accepts time as field', () => {
        expect(isValidField('time')).toBe(true);
    });

    it('doesnt accept save as field', () => {
        console.log(typeof createExampleDish()['save']);
        expect(isValidField('save')).toBe(false);
    });
});
