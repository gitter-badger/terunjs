<?php

namespace App\Form;

use App\Entity\>>entity<<;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class >>s:class_plural_cap<<Type extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        >>symfony-form-builder<<
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
