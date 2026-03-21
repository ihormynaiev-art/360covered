# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e6]
      - generic [ref=e11]: Free VIN Check
      - generic [ref=e12]: Enter your vehicle's VIN to get a detailed report and insurance quote.
    - generic [ref=e13]:
      - generic [ref=e14]:
        - button "Auto" [ref=e15] [cursor=pointer]:
          - img [ref=e16]
          - text: Auto
        - button "Powersports" [ref=e21] [cursor=pointer]:
          - img [ref=e22]
          - text: Powersports
        - button "Golf Carts" [ref=e27] [cursor=pointer]:
          - img [ref=e28]
          - text: Golf Carts
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]: VIN
          - textbox "VIN" [ref=e36]:
            - /placeholder: Enter 17-character VIN
        - button "Check VIN" [disabled]
  - region "Notifications (F8)":
    - list
  - alert [ref=e37]: Get Your Vehicle Warranty Quote | Instant Coverage
  - button "Restart Quote Flow" [ref=e38] [cursor=pointer]:
    - img [ref=e39]
    - generic [ref=e44]: Restart Quote Flow
```