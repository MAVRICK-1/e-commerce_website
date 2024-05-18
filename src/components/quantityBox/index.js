import React, { useState, useEffect } from 'react';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const QuantityBox = (props) => {
  const [inputValue, setinputValue] = useState(props.quantity);
  const [inputItems, setInputItems] = useState([]);
  const uid = localStorage.getItem('uid');
  useEffect(() => {
    setInputItems(props.inputItems);
    //setinputValue(props.item.quantity)
  }, [props.inputItems]);

  const updateInfo = (items) => {
    props.updateInfo(items);
  };
  const updateDb = async (uid, itemId, newData) => {
    const itemRef = doc(db, props.name, uid, 'products', itemId);

    try {
      await updateDoc(itemRef, newData);
      console.log('item updated successfully.');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // const plus = () => {
  //     setinputValue(inputValue + 1)
  // }

  // const minus = () => {
  //     if (inputValue !== 1) {
  //         setinputValue(inputValue - 1)
  //     }
  // }

  return (
    <div className="addCartSection pt-4 pb-4 d-flex align-items-center ">
      <div className="counterSec mr-3">
        <input type="number" value={inputValue} />
        <span
          className="arrow plus"
          onClick={async () => {
            setinputValue(inputValue + 1);
            const _info = props.inputItems?.map((eachItem, key) => {
              return key === parseInt(props.index)
                ? { ...eachItem, quantity: inputValue + 1 }
                : { ...eachItem };
            });
            await updateDb(uid, `${props?.item?.id}`, _info[props?.index]);
            updateInfo(_info);
            setInputItems(_info);
          }}
        >
          <KeyboardArrowUpIcon />
        </span>

        <span
          className="arrow minus"
          onClick={async () => {
            if (inputValue !== 1) {
              setinputValue(inputValue - 1);
            }

            const _info = props.inputItems?.map((eachItem, key) => {
              return key === parseInt(props.index)
                ? {
                    ...eachItem,
                    quantity:
                      eachItem.quantity !== 1
                        ? inputValue - 1
                        : eachItem.quantity
                  }
                : { ...eachItem };
            });
            await updateDb(uid, `${props?.item?.id}`, _info[props?.index]);
            updateInfo(_info);
            setInputItems(_info);
          }}
        >
          <KeyboardArrowDownIcon />
        </span>
      </div>
    </div>
  );
};

export default QuantityBox;
