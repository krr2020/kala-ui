# Resizable Component

Accessible resizable panel groups and layouts with keyboard support, built on top of [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels).

## Components

- **ResizablePanelGroup** - Container for resizable panels
- **ResizablePanel** - Individual resizable panel
- **ResizableHandle** - Draggable handle between panels

## Features

✅ **Horizontal & Vertical Layouts** - Support for both directions  
✅ **Nested Panels** - Create complex layouts with nested groups  
✅ **Visual Handle Indicator** - Optional grip dots for better UX  
✅ **Size Constraints** - Set min/max sizes for panels  
✅ **Collapsible Panels** - Programmatic collapse/expand API  
✅ **Imperative Controls** - Full API for programmatic control  
✅ **Keyboard Navigation** - Arrow keys with customizable increments  
✅ **Persistent Layouts** - Auto-save to localStorage  
✅ **Fully Accessible** - Complete keyboard and screen reader support  
✅ **Mouse, Touch & Keyboard** - Works on all input methods

## Usage

### Basic Horizontal Layout

\`\`\`tsx
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@repo/ui/resizable';

function App() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[300px] rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div>Left Panel</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div>Right Panel</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
\`\`\`

### With Visual Handle

\`\`\`tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>Content</ResizablePanel>
</ResizablePanelGroup>
\`\`\`

### Vertical Layout

\`\`\`tsx
<ResizablePanelGroup direction="vertical" className="min-h-[400px]">
  <ResizablePanel defaultSize={25}>Header</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={75}>Content</ResizablePanel>
</ResizablePanelGroup>
\`\`\`

### Nested Panels

\`\`\`tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={30}>Header</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70}>Content</ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>
\`\`\`

### Size Constraints

\`\`\`tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
    Constrained Panel (20%-40%)
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Flexible Panel</ResizablePanel>
</ResizablePanelGroup>
\`\`\`

### Collapsible Panel

\`\`\`tsx
import { useRef, useState } from 'react';
import type { ImperativePanelHandle } from '@repo/ui/resizable';

function App() {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const togglePanel = () => {
    if (isCollapsed) {
      panelRef.current?.expand();
    } else {
      panelRef.current?.collapse();
    }
  };

  return (
    <>
      <button onClick={togglePanel}>
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          ref={panelRef}
          defaultSize={30}
          collapsible
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
        >
          Sidebar
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Content</ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
\`\`\`

### Imperative Panel Group Controls

\`\`\`tsx
import { useRef } from 'react';
import type { ImperativePanelGroupHandle } from '@repo/ui/resizable';

function App() {
  const groupRef = useRef<ImperativePanelGroupHandle>(null);

  const resetLayout = () => {
    groupRef.current?.setLayout([25, 50, 25]);
  };

  const getLayout = () => {
    const layout = groupRef.current?.getLayout();
    console.log('Current layout:', layout);
  };

  return (
    <>
      <button onClick={resetLayout}>Reset to 25-50-25</button>
      <button onClick={getLayout}>Get Layout</button>
      <ResizablePanelGroup ref={groupRef} direction="horizontal">
        <ResizablePanel minSize={10}>Left</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={10}>Middle</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={10}>Right</ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
\`\`\`

### Persistent Layout (localStorage)

\`\`\`tsx
<ResizablePanelGroup 
  direction="horizontal" 
  autoSaveId="my-layout"
>
  <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>Content</ResizablePanel>
</ResizablePanelGroup>
\`\`\`

### Keyboard Navigation

\`\`\`tsx
<ResizablePanelGroup 
  direction="horizontal" 
  keyboardResizeBy={5} // 5% per keypress
>
  <ResizablePanel defaultSize={50}>Left</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={50}>Right</ResizablePanel>
</ResizablePanelGroup>
\`\`\`

**Keyboard Controls:**
- Focus the handle (Tab key or click)
- Use Arrow keys (←/→ for horizontal, ↑/↓ for vertical)
- Default: 10% per keypress
- Customize with \`keyboardResizeBy\` prop

### Disabled Handle

\`\`\`tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>Left</ResizablePanel>
  <ResizableHandle disabled />
  <ResizablePanel defaultSize={50}>Right</ResizablePanel>
</ResizablePanelGroup>
\`\`\`

## API Reference

### ResizablePanelGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| direction | \`"horizontal" \| "vertical"\` | Required | Layout direction |
| className | \`string\` | - | Additional CSS classes |
| autoSaveId | \`string\` | - | Key for localStorage persistence |
| keyboardResizeBy | \`number\` | 10 | Keyboard resize increment (%) |
| onLayout | \`(sizes: number[]) => void\` | - | Callback when layout changes |

### ResizablePanel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultSize | \`number\` | - | Initial size (percentage) |
| minSize | \`number\` | - | Minimum size (percentage) |
| maxSize | \`number\` | - | Maximum size (percentage) |
| collapsible | \`boolean\` | false | Allow panel to collapse |
| className | \`string\` | - | Additional CSS classes |
| onCollapse | \`() => void\` | - | Callback when collapsed |
| onExpand | \`() => void\` | - | Callback when expanded |
| onResize | \`(size: number) => void\` | - | Callback on resize |

### ResizableHandle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| withHandle | \`boolean\` | false | Show visual grip indicator |
| disabled | \`boolean\` | false | Disable resizing |
| className | \`string\` | - | Additional CSS classes |
| onDragging | \`(isDragging: boolean) => void\` | - | Callback during drag |

## Imperative API

### ImperativePanelHandle

\`\`\`tsx
interface ImperativePanelHandle {
  collapse: () => void;
  expand: () => void;
  resize: (size: number) => void;
  getSize: () => number;
  getId: () => string;
  isCollapsed: () => boolean;
  isExpanded: () => boolean;
}
\`\`\`

### ImperativePanelGroupHandle

\`\`\`tsx
interface ImperativePanelGroupHandle {
  setLayout: (sizes: number[]) => void;
  getLayout: () => number[];
  getId: () => string;
}
\`\`\`

## Real-World Use Cases

### IDE Layout

Perfect for code editors with file explorer, editor, and properties panels.

### Dashboard

Create flexible dashboard layouts with resizable widgets and sidebars.

### Admin Panel

Build admin interfaces with collapsible navigation and resizable content areas.

### Email Client

Implement mail client layouts with folder list, message list, and preview pane.

## Accessibility

- ✅ Full keyboard navigation support
- ✅ ARIA attributes for screen readers
- ✅ Focus management
- ✅ Visible focus indicators
- ✅ Mouse, touch, and keyboard input

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## License

MIT
