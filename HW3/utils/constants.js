const ROLE = { SHIPPER: 'SHIPPER', DRIVER: 'DRIVER' };

const TYPE = {
    SPRINTER: 'SPRINTER',
    SMALL_STRAIGHT: 'SMALL STRAIGHT',
    LARGE_STRAIGHT: 'LARGE STRAIGHT',
};
const STATUS = { IS: 'IS', OL: 'OL' };

const LOAD_STATE = [
    'Ready to Pick Up',
    'En route to Pick up',
    'Arrived to Pick Up',
    'En route to delivery',
    'Arrived to delivery',
];
const LOAD_STATUS = {
    NEW: 'NEW',
    POSTED: 'POSTED',
    ASSIGNED: 'ASSIGNED',
    SHIPPED: 'SHIPPED',
};

module.exports = {
    ROLE,
    LOAD_STATE,
    LOAD_STATUS,
    TYPE,
    STATUS,
};
