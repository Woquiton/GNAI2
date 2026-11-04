import { Fragment, useId } from 'react';
import ImageDisplay from '@/components/UI/ImageDisplay/ImageDisplay';
import ChoiceControl from '@/components/Forms/ChoiceControl/ChoiceControl';
import RecordActions from '@/catalog/components/UI/RecordActions/RecordActions';
import FileDropzone from '@/components/Forms/FileDropzone/FileDropzone';
import ProductFormSection from '@/catalog/components/Forms/ProductFormSection/ProductFormSection';
import { productImages, imageRoles } from './ProductImagesForm.data';
import './ProductImagesForm.css';
export default function ProductImagesForm(): React.JSX.Element {
    const id = useId();
    return (
        <ProductFormSection title="Imagem do produto" images>
            {productImages.map(({ name: image, initialRole }) => (
                <div className="productImagesForm__row" key={image}>
                    <div>
                        <ImageDisplay
                            src={`/assets/react/images/products/${image}.jpg`}
                            alt={image}
                            size="md"
                        />
                    </div>
                    <div>
                        {imageRoles.map((role, index) => (
                            <Fragment key={role}>
                                {index > 0 ? ' ' : null}
                                <ChoiceControl
                                    type="radio"
                                    inline
                                    id={`${id}-${image}-${index}`}
                                    name={`${id}-${image}`}
                                    label={role}
                                    checked={role === initialRole}
                                />
                            </Fragment>
                        ))}
                    </div>
                    <div className="productImagesForm__actions">
                        <RecordActions name={`imagem ${image}`} />
                    </div>
                </div>
            ))}
            <div className="productImagesForm__upload">
                {/* Demonstração: as imagens escolhidas não são enviadas. */}
                <FileDropzone
                    compact
                    message="Arraste as imagens aqui ou clique para enviar"
                    picker={{
                        id: `${id}-upload`,
                        name: 'product_images',
                        accept: '.jpg,.jpeg,.png,.webp',
                        multiple: true,
                        onPick: () => undefined,
                    }}
                />
            </div>
        </ProductFormSection>
    );
}
