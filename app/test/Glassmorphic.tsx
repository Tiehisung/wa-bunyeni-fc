import { Glassmorphic } from "@/components/Glasmorphic/BasicGlassmorphic";
import { GlassmorphicGradient } from "@/components/Glasmorphic/Gradient";

const GlassmorphicTest = () => {
  return (
    <div>
      {/* // Basic usage */}
      <Glassmorphic blur="lg" rounded="xl" className="p-6">
        <h1>Glassmorphic Content</h1>
        <p>This content has a beautiful glass effect</p>
      </Glassmorphic>

      {/* // Gradient glass */}
      <GlassmorphicGradient gradient="primary" animated>
        <div className="p-8">
          <h2>Animated Gradient Glass</h2>
          <p>With shimmer effect</p>
        </div>
      </GlassmorphicGradient>
    </div>
  );
};

export default GlassmorphicTest;
