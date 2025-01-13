import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useTranslation } from "react-i18next";

type BrandsCardProps = {
  photo?: string;
  name: string;
  icon?: string;
  variant?: 'default' | 'large';
};

export default function BrandsCard({ name, variant = 'default', photo }: BrandsCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation('allBrands');

  const handleClick = () => {
    const urlBrandName = name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${urlBrandName}/products`);
  };

  const cardClasses = variant === 'large' 
    ? "flex flex-col items-center p-4 bg-white rounded-xl shadow-lg w-72 hover:shadow-xl transition-shadow duration-300"
    : "flex flex-col items-center p-2 bg-gray-100 rounded-lg shadow-sm w-[350px]";

  const imageClasses = variant === 'large'
    ? "w-full h-40 bg-red-500 flex items-center justify-center rounded-lg mb-4"
    : "w-full h-24 bg-red-500 flex items-center justify-center";

  const textClasses = variant === 'large'
    ? "text-lg font-bold"
    : "text-sm font-semibold";

  const buttonClasses = variant === 'large'
    ? "!w-full !py-2 !px-6 !text-base mt-2"
    : "!w-auto !py-1 !px-3 !text-sm";

  return (
    <div className={cardClasses}>
      <div className={imageClasses}>
        {photo ? (
          <img src={photo} alt={name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-white text-sm">Image placeholder</span>
        )}
      </div>
      <div className={variant === 'large' ? "w-full text-center" : "w-full flex justify-between items-center mt-2"}>
        <span className={textClasses}>{name}</span>
        {variant !== 'large' && (
          <Button 
            name={t('viewProducts')}
            type="button"
            className={buttonClasses}
            onClick={handleClick}
          />
        )}
      </div>
      {variant === 'large' && (
        <Button 
          name={t('viewProducts')}
          type="button"
          className={buttonClasses}
          onClick={handleClick}
        />
      )}
    </div>
  );
}
