<?php

namespace App\Controller;

use >>s:class_cap<<;
use App\Form\>>s:class_cap<<Type;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Core\CoreController;

/**
 * @Route(">>entity<<")
 */
class >>s:class_cap<<Controller extends CoreController
{
    function __construct()
    {
        $this->title = " >>s:class_cap<<";
    }
    /**
     * @Route("/", name=">>s:class_lower<<_index", methods="GET")
     */

    public function index(Request $request): Response
    {
        $>>s:class_plural_lower<< = $this->getDoctrine()
            ->getRepository(>>s:class_cap<<Type::class)
            ->findAll();
        
        $pagination = $this->paginate($>>s:class_plural_lower<<, $request);

        return $this->render('>>s:class_lower<</index.html.twig', [
            '>>s:class_plural_lower<<' => $>>s:class_plural_lower<<,
            'title'=> $this->title,
            'pagination' => $pagination
        ]);
    }

    /**
     * @Route("/new", name=">>s:class_lower<<_new", methods="GET|POST")
     */
    public function new(Request $request): Response
    {
        $>>s:class_lower<< = new >>s:class_cap<<();
        $form = $this->createForm(>>s:class_cap<<Type::class, $>>s:class_lower<<);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($>>entity<<);
            $em->flush();

            $this->addFlash('success', $this->title." criado com sucesso");
            return $this->redirectToRoute('>>entity<<_index');
        }

        return $this->render('>>entity<</new.html.twig', [
            '>>entity<<' => $>>entity<<,
            'form' => $form->createView(),
            'title'=> $this->title
        ]);
    }

    /**
     * @Route("/{>>entity<<}", name=">>entity<<_show", methods="GET")
     */
    public function show(>>entity<< $>>entity<<): Response
    {
        return $this->render('>>entity<</show.html.twig', [
            '>>entity<<' => $>>entity<<,
            'title'=> $this->title
        ]);
    }

    /**
     * @Route("/{>>entity<<}/edit", name=">>entity<<_edit", methods="GET|POST")
     */
    public function edit(Request $request, >>entity<< $>>entity<<): Response
    {
        $form = $this->createForm(>>entity<<::class, $>>entity<<);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', $this->title." atualizado com sucesso");
            return $this->redirectToRoute('>>entity<<_index');
        }

        return $this->render('>>entity<</edit.html.twig', [
            '>>entity<<' => $>>entity<<,
            'form' => $form->createView(),
            'title'=> $this->title
        ]);
    }

    /**
     * @Route("/{>>entity<<}", name=">>entity<<_delete", methods="DELETE")
     */
    public function delete(Request $request, >>entity<< $>>entity<<): Response
    {
        if ($this->isCsrfTokenValid('delete'.$>>entity<<->get>>entity<<(), $request->request->get('_token'))) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($>>entity<<);
            $em->flush();
        }

        return $this->redirectToRoute('>>entity<<_index');
    }
}
