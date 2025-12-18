---
trigger: model_decision
description: Frontend work. Whe working with components, themes, responsive, darkmode
---

VoxelQuote Frontend Coding Patterns
Quick Reference Guide for Responsive Design & Dark Mode

🎨 Dark Mode / Theming
Always Use CSS Variables (Never Hardcode Colours)
tsx
// ✅ CORRECT - Uses CSS variables

<div className="bg-card text-foreground">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Description</p>
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Click Me
  </button>
</div>

// ❌ WRONG - Hardcoded colours

<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <button className="bg-blue-600 hover:bg-blue-700">Click Me</button>
</div>
CSS Variable Reference
Use Case	Class	Example
Backgrounds		
Main background	bg-background	Page background
Card background	bg-card	Cards, panels
Subtle background	bg-muted	Hover states, disabled
Text		
Primary text	text-foreground	Headings, body text
Secondary text	text-muted-foreground	Labels, captions
Interactive		
Primary button	bg-primary text-primary-foreground	Main actions
Hover state	hover:bg-muted/50	Buttons, links
Border	border	No colour needed
Focus ring	focus:ring-ring	Form inputs
Semantic Colours (Keep These)
tsx
// ✅ Keep semantic colours for meaning
<Badge className="bg-green-600">Success</Badge>
<Badge className="bg-red-600">Error</Badge>
<Badge className="bg-blue-600">Info</Badge>
<Badge className="bg-amber-600">Warning</Badge>
📱 Responsive Design
Breakpoint Strategy (Mobile-First)
tsx
// Breakpoints
sm: 640px   // Small tablets, large phones
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
Grid Patterns
tsx
// 1 → 2 → 3 columns (most common)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// 2 → 3 → 4 columns (dashboard cards)

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

// 1 → 2 → 5 columns (quote summary)

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

// Form fields (2 columns on desktop)

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
Button Groups
tsx
// Stack on mobile, horizontal on desktop
// Primary button appears FIRST on mobile (top), LAST on desktop (right)
<div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
  <Button variant="outline" className="w-full sm:w-auto">
    Cancel
  </Button>
  <Button className="w-full sm:w-auto">
    Submit
  </Button>
</div>
Table Pattern (Desktop Table + Mobile Cards)
tsx
// Desktop: Full table
<div className="hidden md:block">
  <Table>
    <TableHeader>...</TableHeader>
    <TableBody>...</TableBody>
  </Table>
</div>

// Mobile: Card view

<div className="md:hidden space-y-4">
  {items.map(item => (
    <Card key={item.id}>
      <CardHeader>
        <h3>{item.name}</h3>
      </CardHeader>
      <CardContent>
        {/* Show key info */}
      </CardContent>
    </Card>
  ))}
</div>
Layout Patterns
tsx
// Header with actions (stack on mobile)
<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
  <div className="flex-1">
    <h1>Title</h1>
    <p>Description</p>
  </div>
  <div className="flex flex-col sm:flex-row gap-2">
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </div>
</div>

// Content with sidebar (stack on mobile)

<div className="flex flex-col lg:flex-row gap-6">
  <main className="flex-1">Main content</main>
  <aside className="lg:w-64">Sidebar</aside>
</div>
🎯 Dialog / Modal Patterns
Dialog Sizes
tsx
// Small dialog (default)
<DialogContent className="sm:max-w-lg">

// Medium dialog
<DialogContent className="sm:max-w-2xl">

// Large dialog
<DialogContent className="sm:max-w-4xl">

// Extra large dialog
<DialogContent className="sm:max-w-6xl">
Dialog Content
tsx

<Dialog>
  <DialogContent className="sm:max-w-2xl">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    
    {/* Content automatically scrolls if too long */}
    <div className="space-y-4">
      {/* Your content */}
    </div>
    
    <DialogFooter>
      {/* Buttons stack on mobile, horizontal on desktop */}
      <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
      <Button className="w-full sm:w-auto">Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
📝 Form Patterns
Input Fields
tsx
// Always use bg-background and text-foreground
<input
  type="text"
  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
/>

// Textarea with responsive height
<Textarea
  className="min-h-[200px] sm:min-h-[300px]"
/>
Form Layout
tsx
// Two-column form (stacks on mobile)

<form className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        First Name
      </label>
      <input className="w-full px-3 py-2 border rounded-lg bg-background text-foreground" />
    </div>
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        Last Name
      </label>
      <input className="w-full px-3 py-2 border rounded-lg bg-background text-foreground" />
    </div>
  </div>
  
  {/* Full-width field */}
  <div>
    <label className="block text-sm font-medium text-foreground mb-1">
      Email
    </label>
    <input className="w-full px-3 py-2 border rounded-lg bg-background text-foreground" />
  </div>
</form>
🎴 Card Patterns
tsx
// Standard card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// Clickable card with hover
<Card className="cursor-pointer hover:bg-muted/50 transition-colors">
{/_ Content _/}
</Card>

// Highlighted card
<Card className="border-2 border-primary bg-primary/5">
{/_ Content _/}
</Card>
🔘 Button Patterns
tsx
// Primary button
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
Primary Action
</Button>

// Secondary button
<Button variant="outline">
Secondary Action
</Button>

// Destructive button
<Button variant="destructive">
Delete
</Button>

// Ghost button
<Button variant="ghost">
Cancel
</Button>

// With icon
<Button>
<Plus className="mr-2 h-4 w-4" />
Add Item
</Button>

// Loading state
<Button disabled={loading}>
{loading ? (
<>
<Loader2 className="mr-2 h-4 w-4 animate-spin" />
Loading...
</>
) : (
'Submit'
)}
</Button>
📊 Common Patterns
Stats/Metrics Grid
tsx

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  <Card>
    <CardContent className="p-6">
      <div className="text-sm text-muted-foreground">Total Projects</div>
      <div className="text-2xl font-bold text-foreground">24</div>
    </CardContent>
  </Card>
  {/* More cards */}
</div>
Section with Header
tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold text-foreground">Section Title</h2>
    <Button>Action</Button>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Content */}
  </div>
</div>
Empty State
tsx
<div className="text-center py-12 border rounded-lg">
  <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
  <p className="text-muted-foreground mb-4">No items found</p>
  <Button>Create First Item</Button>
</div>
⚡ Quick Checklist
When creating a new component:

Use bg-card for card backgrounds
Use text-foreground for primary text
Use text-muted-foreground for secondary text
Use border alone (no colour)
Make buttons full-width on mobile: w-full sm:w-auto
Stack button groups on mobile: flex-col-reverse sm:flex-row
Use responsive grids: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
Add tablet breakpoints (sm/md) not just mobile/desktop
Test in both light and dark mode
Test on mobile (320px), tablet (768px), desktop (1024px+)
