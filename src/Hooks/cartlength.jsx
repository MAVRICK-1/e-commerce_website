import { useState } from 'react';

const getCartlen = () => {
    const [cartlen, setcartlen] = useState(0);

    const reactivelen = (x) => {
        setcartlen(x);
    };

    return [cartlen ,reactivelen];
};

export default getCartlen;
