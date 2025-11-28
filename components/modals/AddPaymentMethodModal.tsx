
import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { Select } from '../ui/Select';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: any) => void;
  initialMethod?: any;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({ isOpen, onClose, onSave, initialMethod }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [cardType, setCardType] = useState('Visa');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
        setErrors({});
        if (initialMethod) {
            setCardNumber(initialMethod.last4 ? `**** **** **** ${initialMethod.last4}` : '');
            setExpiry(initialMethod.expiry || '');
            setName(initialMethod.cardholderName || '');
            setCardType(initialMethod.type || 'Visa');
            setCvv(''); 
        } else {
            setCardNumber('');
            setExpiry('');
            setCvv('');
            setName('');
            setCardType('Visa');
        }
    }
  }, [isOpen, initialMethod]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, ''); 
      if (val.length > 16) val = val.substring(0, 16); 
      
      const parts = [];
      for (let i = 0; i < val.length; i += 4) {
          parts.push(val.substring(i, i + 4));
      }
      const formatted = parts.join(' ');
      
      setCardNumber(formatted);
      if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
      
      if (val.startsWith('4')) setCardType('Visa');
      else if (val.startsWith('5')) setCardType('Mastercard');
      else if (val.startsWith('3')) setCardType('American Express');
      else if (val.startsWith('6')) setCardType('Discover');
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 4) val = val.substring(0, 4);
      
      if (val.length >= 2) {
          setExpiry(val.substring(0, 2) + '/' + val.substring(2));
      } else {
          setExpiry(val);
      }
      
      if (errors.expiry) setErrors(prev => ({ ...prev, expiry: '' }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, '').substring(0, 4);
      setCvv(val);
      if (errors.cvv) setErrors(prev => ({ ...prev, cvv: '' }));
  };

  const validate = () => {
      const newErrors: Record<string, string> = {};
      
      if (!name.trim()) newErrors.name = "Cardholder name is required";
      
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      if (!initialMethod && cleanCardNumber.length < 13) {
          newErrors.cardNumber = "Invalid card number length";
      }
      
      if (!expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
          newErrors.expiry = "Invalid format (MM/YY)";
      } else {
          const [month, year] = expiry.split('/');
          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;
          
          if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
              newErrors.expiry = "Card has expired";
          }
      }
      
      if (!initialMethod && cvv.length < 3) {
          newErrors.cvv = "Invalid CVV";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const methodData: any = {
        ...initialMethod,
        expiry,
        cardholderName: name,
        type: cardType,
    };

    if (!initialMethod) {
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        const last4 = cleanCardNumber.slice(-4);
        
        methodData.id = `card-${Date.now()}`;
        methodData.category = 'cards';
        methodData.last4 = last4;
        methodData.isDefault = false;
    }

    onSave(methodData);
    onClose();
  };

  const getCardGradient = () => {
      const type = cardType.toLowerCase();
      if (type.includes('visa')) return 'bg-gradient-to-br from-blue-900 to-indigo-800';
      if (type.includes('mastercard')) return 'bg-gradient-to-br from-orange-900 to-red-900';
      if (type.includes('amex') || type.includes('american')) return 'bg-gradient-to-br from-cyan-900 to-blue-900';
      if (type.includes('discover')) return 'bg-gradient-to-br from-yellow-800 to-orange-900';
      return 'bg-gradient-to-br from-gray-800 to-gray-900';
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialMethod ? "Edit Card Details" : "Add New Card"}>
      <div className="space-y-6">
        
        {/* Visual Card Preview */}
        <div className={`relative w-full aspect-[1.586/1] rounded-xl p-5 shadow-2xl overflow-hidden ${getCardGradient()} border border-white/10 transition-colors duration-500`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCardIcon className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full text-white">
                <div className="flex justify-between items-start">
                    <span className="font-bold italic text-lg opacity-90">{cardType}</span>
                    <CreditCardIcon className="w-8 h-8 opacity-80" />
                </div>
                <div className="mt-2">
                    <p className="text-xl tracking-widest font-mono drop-shadow-md">
                        {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                </div>
                <div className="flex justify-between items-end mt-2">
                    <div>
                        <p className="text-[9px] uppercase tracking-wider opacity-70 mb-0.5">Card Holder</p>
                        <p className="text-sm font-medium tracking-wide uppercase truncate max-w-[180px]">{name || 'YOUR NAME'}</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-wider opacity-70 mb-0.5">Expires</p>
                        <p className="text-sm font-medium tracking-wide">{expiry || 'MM/YY'}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4 pt-2">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
                <div className="relative">
                    <Input 
                        placeholder="0000 0000 0000 0000" 
                        value={cardNumber} 
                        onChange={handleCardNumberChange} 
                        prefixIcon={<CreditCardIcon className="w-5 h-5"/>} 
                        disabled={!!initialMethod}
                        className={initialMethod ? "opacity-50 cursor-not-allowed" : ""}
                        maxLength={19} 
                    />
                </div>
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Card Type</label>
                    <Select value={cardType} onChange={e => setCardType(e.target.value)} disabled={!!initialMethod}>
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="American Express">American Express</option>
                        <option value="Discover">Discover</option>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                    <Input placeholder="MM/YY" value={expiry} onChange={handleExpiryChange} maxLength={5} />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">CVV</label>
                    <Input 
                        placeholder="123" 
                        value={cvv} 
                        onChange={handleCvvChange} 
                        type="password" 
                        maxLength={4} 
                        disabled={!!initialMethod} 
                        className={initialMethod ? "opacity-50 cursor-not-allowed placeholder-transparent" : ""}
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Cardholder Name</label>
                    <Input placeholder="Name on Card" value={name} onChange={e => { setName(e.target.value); if(errors.name) setErrors({...errors, name: ''}) }} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
            </div>
        </div>
        
        <div className="pt-4 flex gap-3">
            <Button variant="secondary" onClick={onClose} className="w-full">Cancel</Button>
            <Button variant="primary" onClick={handleSave} className="w-full bg-[#EC4899] hover:bg-[#d8428a] text-white">
                {initialMethod ? "Save Changes" : "Add Card"}
            </Button>
        </div>
      </div>
    </Modal>
  );
};
