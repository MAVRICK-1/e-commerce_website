import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddressData({ address, deleteShippingAddress }) {
  const Navigate = useNavigate();
  return (
    <div class="col-md-3 h-100">
      <div class="bg-white card addresses-item mb-4 border border-primary shadow">
        <div class="gold-members p-4">
          <div class="media">
            <div class="mr-3">
              <i class="icofo1nt-ui-home icofont-3x"></i>
            </div>
            <div class="media-body">
              <h4 class="mb-1 text-secondary font-weight-bold text-capitalize font-weight-bold">
                {address?.addressType}
              </h4>
              <p style={{ fontSize: '29px' }}>
                {address?.address} , {address?.city}, {address?.state}{' '}
                {address?.pinCode} , {address?.country}
              </p>
              <p class="text-black font-weight-bold my-3">
                Contact : {address?.phoneNo}
              </p>
              <p class="mb-0 text-black font-weight-bold">
                <button
                  onClick={() => {
                    Navigate(`/update-shipping-address/${address.id}`);
                  }}
                  type="button"
                  className="btn btn-primary  mr-4"
                >
                  <i class="icofont-ui-edit"></i> EDIT
                </button>
                <button
                  onClick={() => deleteShippingAddress(address.id)}
                  type="button"
                  className="btn btn-danger "
                >
                  <i class="icofont-ui-delete"></i> DELETE
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
