import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Container, 
  Grid, 
  Paper, 
  Box,
  IconButton
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Notifications, AccountCircle, Home, Book } from '@mui/icons-material';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#FF6600', // KMITL orange color
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#FF6600',
    color: 'white',
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  whiteIcon: {
    color: 'white',
  },
  creditCard: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  gpaCard: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

const HomePage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
            KMITL
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button selected>
              <Home className={classes.whiteIcon} />
              <ListItemText primary="HOME" style={{ marginLeft: '10px' }} />
            </ListItem>
            <ListItem button>
              <Book className={classes.whiteIcon} />
              <ListItemText primary="การจองเรียน" style={{ marginLeft: '10px' }} />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Paper className={classes.creditCard}>
                <Typography variant="h6">หน่วยกิตทั้งหมด</Typography>
                <Typography variant="h4">4,000</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.creditCard}>
                <Typography variant="h6">หน่วยกิตที่เรียนไปแล้ว</Typography>
                <Typography variant="h4">3,999</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.creditCard}>
                <Typography variant="h6">หน่วยกิตที่ขาด</Typography>
                <Typography variant="h4">1</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <Paper className={classes.gpaCard}>
                <Typography variant="h6">GPA</Typography>
                <Typography variant="h4">4.00</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.gpaCard}>
                <Typography variant="h6">GPS 1/2566</Typography>
                <Typography variant="h4">5.99</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Paper style={{ padding: '20px' }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="h6">GENED</Typography>
                  <Typography>ที่ต้องเรียน ... หน่วยกิต</Typography>
                  <Typography>ที่เรียนไปแล้ว ... หน่วยกิต</Typography>
                  <Typography>ขาดอีก ... หน่วยกิต</Typography>
                  <Typography color="error">ดูรายเอียด</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">วิชาการ</Typography>
                  <Typography>ที่ต้องเรียน ... หน่วยกิต</Typography>
                  <Typography>ที่เรียนไปแล้ว ... หน่วยกิต</Typography>
                  <Typography>ขาดอีก ... หน่วยกิต</Typography>
                  <Typography color="error">ดูรายเอียด</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default HomePage;