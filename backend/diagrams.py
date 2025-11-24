from typing import Optional

def build_svg_diagram() -> Optional[str]:
    """
    Generate system architecture diagram with trust zones and data flows.
    Returns SVG string or None if graphviz not available.
    """
    try:
        from graphviz import Digraph
    except ImportError:
        print("Warning: graphviz not installed. Returning fallback SVG.")
        return get_fallback_svg()
    
    try:
        g = Digraph("VulnModeler", format="svg")
        g.attr(rankdir="LR", fontsize="13", fontname="Arial")
        g.attr(nodesep="0.8", ranksep="1.2", splines="ortho")
        
        # Client zone
        with g.subgraph(name="cluster_0") as c:
            c.attr(label="Client Zone", style="filled", color="#1a1a2e", fontcolor="#eaeaea")
            c.attr(bgcolor="#0f0f1e")
            c.node("user", "Developer\n(User)", shape="box", style="filled", fillcolor="#16213e", fontcolor="#eaeaea", penwidth="2", color="#0f3460")
        
        # Trust boundary
        g.node("tb1", "Trust\nBoundary 1", shape="diamond", style="filled", fillcolor="#ff006e", fontcolor="white", penwidth="2")
        
        # Processing zone
        with g.subgraph(name="cluster_1") as p:
            p.attr(label="Processing Zone", style="filled", color="#1a1a2e", fontcolor="#eaeaea")
            p.attr(bgcolor="#0f0f1e")
            p.node("upload", "File Upload\nValidator", shape="ellipse", style="filled", fillcolor="#16213e", fontcolor="#eaeaea")
            p.node("parser", "Code Parser", shape="ellipse", style="filled", fillcolor="#16213e", fontcolor="#eaeaea")
            p.node("scanner", "Security\nScanner", shape="ellipse", style="filled", fillcolor="#16213e", fontcolor="#eaeaea")
            p.node("threat", "Threat Model\nEngine", shape="ellipse", style="filled", fillcolor="#16213e", fontcolor="#eaeaea")
            p.node("report", "Report\nGenerator", shape="ellipse", style="filled", fillcolor="#16213e", fontcolor="#eaeaea")
        
        # Trust boundary
        g.node("tb2", "Trust\nBoundary 2", shape="diamond", style="filled", fillcolor="#ff006e", fontcolor="white", penwidth="2")
        
        # Storage zone
        with g.subgraph(name="cluster_2") as s:
            s.attr(label="Storage Zone", style="filled", color="#1a1a2e", fontcolor="#eaeaea")
            s.attr(bgcolor="#0f0f1e")
            s.node("reports_db", "Reports\n(JSON)", shape="cylinder", style="filled", fillcolor="#16213e", fontcolor="#eaeaea", penwidth="2", color="#0f3460")
            s.node("logs", "Security\nLogs", shape="cylinder", style="filled", fillcolor="#16213e", fontcolor="#eaeaea", penwidth="2", color="#0f3460")
        
        # Data flows
        g.edge("user", "tb1", label="DF1", style="solid", color="#0f3460", penwidth="2")
        g.edge("tb1", "upload", label="Upload", color="#0f3460", penwidth="1.5")
        g.edge("upload", "parser", label="DF2", color="#0f3460", penwidth="1.5")
        g.edge("parser", "scanner", label="DF3", color="#0f3460", penwidth="1.5")
        g.edge("scanner", "threat", label="DF4", color="#0f3460", penwidth="1.5")
        g.edge("threat", "report", label="DF5", color="#0f3460", penwidth="1.5")
        g.edge("report", "tb2", label="DF6", style="solid", color="#0f3460", penwidth="2")
        g.edge("tb2", "reports_db", label="Store", color="#0f3460", penwidth="1.5")
        g.edge("tb2", "logs", label="Audit", color="#0f3460", penwidth="1.5")
        g.edge("reports_db", "user", label="DF8: Download", color="#0f3460", penwidth="1.5")
        
        return g.pipe(format="svg").decode("utf-8")
    
    except Exception as e:
        print(f"Error generating diagram: {e}")
        return get_fallback_svg()

def get_fallback_svg() -> str:
    """Return a basic SVG if graphviz is not available."""
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
        <defs><style>.box{fill:#16213e;stroke:#0f3460;stroke-width:2;}.text{fill:#eaeaea;font-family:Arial;font-size:12px;text-anchor:middle;}</style></defs>
        <rect class="box" x="50" y="150" width="100" height="60" rx="5"/><text class="text" x="100" y="185">Upload</text>
        <rect class="box" x="200" y="150" width="100" height="60" rx="5"/><text class="text" x="250" y="185">Scanner</text>
        <rect class="box" x="350" y="150" width="100" height="60" rx="5"/><text class="text" x="400" y="185">Threats</text>
        <rect class="box" x="500" y="150" width="100" height="60" rx="5"/><text class="text" x="550" y="185">Report</text>
        <rect class="box" x="650" y="150" width="100" height="60" rx="5"/><text class="text" x="700" y="185">Storage</text>
        <line x1="150" y1="180" x2="200" y2="180" stroke="#0f3460" stroke-width="2"/><text class="text" x="172" y="175">DF2</text>
        <line x1="300" y1="180" x2="350" y2="180" stroke="#0f3460" stroke-width="2"/><text class="text" x="322" y="175">DF3</text>
        <line x1="450" y1="180" x2="500" y2="180" stroke="#0f3460" stroke-width="2"/><text class="text" x="472" y="175">DF5</text>
        <line x1="600" y1="180" x2="650" y2="180" stroke="#0f3460" stroke-width="2"/><text class="text" x="622" y="175">DF6</text>
    </svg>'''
