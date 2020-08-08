//made w help from dan schiffmans yt vid

class Boid {
  constructor(t) {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(0, 1));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 3;
    this.type = t;
  }

  edges() {
    if (this.position.x > width || this.position.x < 0 || this.position.y > height || this.position.y < 0) {
      this.velocity = this.velocity.mult(-1);
    }
  }

  align(boids) {
    let perceptionRadius = 25;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    
    return steering;
  }
  
  

  separation(boids) {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }  
    
    return steering;
  }

  cohesion(boids, blu) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    
    if (blu.leader > 0) {
      let prblue = perceptionRadius * 5;
      let dblue = dist(this.position.x, this.position.y, blu.position.x, blu.position.y);
      if (dblue < prblue) {
         steering.add(blu.position); 
         steering.sub(this.position);
         steering.setMag(this.maxSpeed);
         steering.sub(this.velocity);
         steering.limit(this.maxForce);
      }
    }
    
    
    return steering;
  }

  flock(boids, blu) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids, blu);
    let separation = this.separation(boids);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    if (this.type == 0) {
      stroke('black');
      noFill();
      ellipse(this.position.x, this.position.y, 5, 5);
    }
    else {
      stroke('red');
      noFill();
      ellipse(this.position.x, this.position.y, 5, 5);
    }
  }
  
  
  
}
