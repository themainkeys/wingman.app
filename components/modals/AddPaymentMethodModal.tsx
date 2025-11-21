
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CreditCardIcon } from '../icons/CreditCardIcon';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: any) => void;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!cardNumber || !expiry || !cvv || !name) {
        alert("Please fill in all fields");
        return;
    }

    // Mock logic to determine card brand
    const firstDigit = cardNumber.replace(/\D/g, '')[0];
    let brand = 'Card';
    if (firstDigit === '4') brand = 'Visa';
    if (firstDigit === '5') brand = 'Mastercard';
    if (firstDigit === '3') brand = 'American Express';

    const last4 = cardNumber.slice(-4) || '0000';

    onAdd({
      id: `card-${Date.now()}`,
      category: 'cards',
      type: brand,
      last4,
      expiry,
      isDefault: false
    });

    // Reset and close
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Card">
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
            <Input 
                placeholder="0000 0000 0000 0000" 
                value={cardNumber} 
                onChange={e => setCardNumber(e.target.value)} 
                prefixIcon={<CreditCardIcon className="w-5 h-5"/>} 
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                <Input placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">CVV</label>
                <Input placeholder="123" value={cvv} onChange={e => setCvv(e.target.value)} type="password" maxLength={4} />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Cardholder Name</label>
            <Input placeholder="Name on Card" value={name} onChange={e => setName(e.target.value)} />
        </div>
        
        <div className="pt-4 flex gap-3">
            <Button variant="secondary" onClick={onClose} className="w-full">Cancel</Button>
            <Button variant="primary" onClick={handleSave} className="w-full">Add Card</Button>
        </div>
      </div>
    </Modal>
  );
};
