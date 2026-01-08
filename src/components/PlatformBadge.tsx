import { Badge } from "@/components/ui/badge";

interface PlatformBadgeProps {
  platform: "twitter" | "reddit" | "instagram" | "facebook";
  size?: "sm" | "md";
}

const platformConfig = {
  twitter: {
    label: "Twitter",
    icon: "𝕏",
    color: "bg-[#1DA1F2]/10 text-[#1DA1F2] border-[#1DA1F2]/20"
  },
  reddit: {
    label: "Reddit",
    icon: "📱",
    color: "bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/20"
  },
  instagram: {
    label: "Instagram",
    icon: "📸",
    color: "bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/20"
  },
  facebook: {
    label: "Facebook",
    icon: "📘",
    color: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20"
  }
};

export function PlatformBadge({ platform, size = "sm" }: PlatformBadgeProps) {
  const config = platformConfig[platform];
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-1"}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}
