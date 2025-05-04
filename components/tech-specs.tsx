"use client"

import { motion } from "framer-motion"
import { Cpu, Zap, Clock, Shield, Layers, Maximize } from "lucide-react"

export function TechSpecs() {
  const specs = [
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Neural Network",
      value: "Advanced",
      description: "State-of-the-art deep learning architecture",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Processing Speed",
      value: "0.5s",
      description: "Lightning-fast animation generation",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Real-time",
      value: "Yes",
      description: "Instant feedback as you create",
      color: "from-pink-400 to-pink-600",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security",
      value: "End-to-end",
      description: "Your data is always protected",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Model Layers",
      value: "152+",
      description: "Deep architecture for precise results",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      icon: <Maximize className="h-6 w-6" />,
      title: "Output Quality",
      value: "4K",
      description: "Crystal clear animations",
      color: "from-pink-400 to-pink-600",
    },
  ]

  return (
    <section className="py-20 md:py-28 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
            Cutting-Edge Technology
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">Powered by advanced neural networks and state-of-the-art AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 shadow-lg shadow-purple-700/10"
            >
              <div className="flex items-start">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${spec.color} flex items-center justify-center mr-4 flex-shrink-0`}
                >
                  {spec.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{spec.title}</h3>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                    {spec.value}
                  </div>
                  <p className="text-gray-400 text-sm">{spec.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Code snippet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-black/50 backdrop-blur-md rounded-xl border border-purple-500/30 p-6 shadow-lg shadow-purple-700/10 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center px-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-4 text-xs text-gray-400 font-mono">facemojo-ai-core.js</div>
          </div>

          <pre className="font-mono text-xs text-gray-300 mt-8 p-4 overflow-x-auto">
            <code>
              <span className="text-pink-400">class</span> <span className="text-cyan-400">FaceMojoAI</span> {"{"}
              <br />
              {"  "}
              <span className="text-pink-400">constructor</span>() {"{"}
              <br />
              {"    "}this.model = <span className="text-pink-400">null</span>;
              <br />
              {"    "}this.isReady = <span className="text-pink-400">false</span>;
              <br />
              {"  "}
              {"}"}
              <br />
              <br />
              {"  "}
              <span className="text-pink-400">async</span> <span className="text-cyan-400">initialize</span>() {"{"}
              <br />
              {"    "}
              <span className="text-purple-400">try</span> {"{"}
              <br />
              {"      "}console.log(<span className="text-green-400">"Loading FaceMojo neural network..."</span>);
              <br />
              {"      "}this.model = <span className="text-pink-400">await</span> tf.loadLayersModel(
              <span className="text-green-400">'https://facemojo.ai/models/animation-v2/model.json'</span>);
              <br />
              {"      "}this.isReady = <span className="text-pink-400">true</span>;
              <br />
              {"      "}
              <span className="text-pink-400">return</span> <span className="text-pink-400">true</span>;
              <br />
              {"    }"} <span className="text-purple-400">catch</span> (error) {"{"}
              <br />
              {"      "}console.error(<span className="text-green-400">"Failed to initialize FaceMojo AI:"</span>,
              error);
              <br />
              {"      "}
              <span className="text-pink-400">return</span> <span className="text-pink-400">false</span>;
              <br />
              {"    "}
              {"}"}
              <br />
              {"  "}
              {"}"}
              <br />
              <br />
              {"  "}
              <span className="text-pink-400">async</span> <span className="text-cyan-400">processImage</span>
              (imageData, targetVideo) {"{"}
              <br />
              {"    "}
              <span className="text-purple-400">if</span> (!this.isReady) {"{"}
              <br />
              {"      "}
              <span className="text-pink-400">throw new</span> Error(
              <span className="text-green-400">"FaceMojo AI is not initialized"</span>);
              <br />
              {"    "}
              {"}"}
              <br />
              <br />
              {"    "}
              <span className="text-gray-500">// Convert image to tensor</span>
              <br />
              {"    "}
              <span className="text-pink-400">const</span> imageTensor = tf.browser.fromPixels(imageData);
              <br />
              {"    "}
              <span className="text-pink-400">const</span> normalized = imageTensor.div(tf.scalar(
              <span className="text-yellow-400">255.0</span>));
              <br />
              {"    "}
              <span className="text-pink-400">const</span> batched = normalized.expandDims(
              <span className="text-yellow-400">0</span>);
              <br />
              <br />
              {"    "}
              <span className="text-gray-500">// Run inference</span>
              <br />
              {"    "}
              <span className="text-pink-400">const</span> result = <span className="text-pink-400">await</span>{" "}
              this.model.predict(batched);
              <br />
              {"    "}
              <span className="text-pink-400">const</span> landmarks = result.dataSync();
              <br />
              <br />
              {"    "}
              <span className="text-gray-500">// Apply animation</span>
              <br />
              {"    "}
              <span className="text-pink-400">return</span> <span className="text-pink-400">this</span>
              .applyAnimation(landmarks, targetVideo);
              <br />
              {"  "}
              {"}"}
              <br />
              {"}"}
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  )
}
