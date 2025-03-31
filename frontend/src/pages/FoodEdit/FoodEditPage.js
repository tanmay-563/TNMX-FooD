import { useParams } from 'react-router-dom';
import classes from './foodEdit.module.css';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { add, getById, update } from '../../services/foodService';
import Title from '../../components/Title/Title';
import InputContainer from '../../components/InputContainer/InputContainer';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function FoodEditPage() {
  const { foodId } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const isEditMode = !!foodId;

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!isEditMode) return;

    // Fetch food by ID if in edit mode
    getById(foodId).then((food) => {
      if (!food) return;
      reset(food);
      setImageUrl(food.imageUrl);
    });
  }, [foodId]);

  // ✅ Handle form submission
  const submit = async (foodData) => {
    const food = { ...foodData, imageUrl };

    if (isEditMode) {
      await update(food);
      toast.success(`Food "${food.name}" updated successfully!`);
    } else {
      const newFood = await add(food);
      toast.success(`Food "${food.name}" added successfully!`);
      navigate('/admin/editFood/' + newFood.id, { replace: true });
    }
  };

  // ✅ Validate if URL is a valid image URL
  const isValidImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title={isEditMode ? 'Edit Food' : 'Add Food'} />
        <form
          className={classes.form}
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          {/* ✅ Image URL Input */}
          <InputContainer label="Image URL">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className={classes.input} // Add custom class if needed
            />
          </InputContainer>

          {/* ✅ Image Preview */}
          {imageUrl ? (
            isValidImageUrl(imageUrl) ? (
              <a
                href={imageUrl}
                className={classes.image_link}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={imageUrl}
                  alt="Preview"
                  className={classes.image_preview}
                />
              </a>
            ) : (
              <p style={{ color: 'red' }}>Invalid image URL. Please enter a valid image link.</p>
            )
          ) : null}

          {/* ✅ Other Food Fields */}
          <Input
            type="text"
            label="Name"
            {...register('name', { required: true, minLength: 5 })}
            error={errors.name}
          />

          <Input
            type="number"
            label="Price"
            {...register('price', { required: true })}
            error={errors.price}
          />

          <Input
            type="text"
            label="Tags"
            {...register('tags')}
            error={errors.tags}
          />

          <Input
            type="text"
            label="Origins"
            {...register('origins', { required: true })}
            error={errors.origins}
          />

          <Input
            type="text"
            label="Cook Time"
            {...register('cookTime', { required: true })}
            error={errors.cookTime}
          />

          {/* ✅ Submit Button */}
          <Button type="submit" text={isEditMode ? 'Update' : 'Create'} />
        </form>
      </div>
    </div>
  );
}
