import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-col justify-center items-center ">
      <Image
        src="/idea_lift_icon.png"
        alt="Logo from Idea Lift"
        width={100}
        height={100}
      />
      <p className="text-lime-600 text-2xl">IdeaLift</p>
    </div>
  );
}
