import React, { useEffect,useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture,useAnimations } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

//dom element jo renderer return karta hai wo canvas hi hota hai

const Dog = () => {
    gsap.registerPlugin(useGSAP)
    gsap.registerPlugin(ScrollTrigger)


  const model = useGLTF("/models/dog.drc.glb"); //component mai load ho gaya
  useThree(({ scene, camera, gl }) => {
    console.log(camera.position);
    camera.position.z = 0.55;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  const {actions} = useAnimations(model.animations,model.scene)

  useEffect(()=>{
    actions["Take 001"].play()
  },[actions])

  const [normalMap, sampleMatCap] = (useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png"
  ])).map(texture => {
    texture.flipY = false,
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  });

  const [branchNormal,branchMatCap] = (useTexture([
    "/branches_diffuse.jpeg","/branches_normals.jpeg"
  ])).map(texture => {
    texture.flipY = true,
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  });

  const dogMaterial = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: sampleMatCap,
  })

  const branchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormal,
    matcap: branchMatCap,
  })
  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = dogMaterial
    }
    else{
        child.material = branchMaterial
    }
  });

  const dogModel = useRef(model)

  useGSAP(()=>{
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#section-1",
            endTrigger: "#section-5",
            start: "top top", //section-1 ka top jab viewport ke top ko cross karega animation start
            end: "bottom bottom", //section-4 ka bottom jab viewport ke bottom ko pahnch jayega animation end
            scrub: true,
        }
    })

    tl
    .to(dogModel.current.scene.position,{
        z: "-=0.5",
        y: "+=0.1"

    })
    .to(dogModel.current.scene.rotation,{
        x: `+=${Math.PI/15}`
    })
    .to(dogModel.current.scene.rotation,{
        y: `-=${Math.PI}`,
    },"third")
    .to(dogModel.current.scene.position,{
        x: "-=0.5",
        z: "+=0.3",
        y: "-=0.05"
    },"third")
  },[])
  return (
    <>
      <primitive
        object={model.scene}
        position={[0.15, -0.55, 0.05]}
        rotation={[0, Math.PI / 5, 0]}
      />
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
      {/* <OrbitControls /> movable bana dega */}
    </>
  );
};

export default Dog;
